;(function (angular, $) {
    angular
        .module("app")
        .controller("userController", ["$scope", function ($scope) {
            var user = JSON.parse($.cookie("user"));
            $scope.nickname = user.nickname;
            $scope.portrait = "/static/upload_img/" + user.portrait;
            var last_modified = (new Date().getTime() - user.last_modified) / (1000 * 60 * 60 );
            if (last_modified > 24) {
                $scope.last_modified = Math.floor(last_modified / 24) + "天前";
            } else {
                $scope.last_modified = "今天"
            }

        }])
        .controller("bloglistController", ["$scope", "$resource", "$cookieStore", function ($scope, $resource, $cookieStore) {

            $(".complete_lis li a").click(function () {
                $(this).parent().addClass("active").siblings().removeClass("active");
            })
            $(".type_lis li a").click(function () {
                $(this).parent().addClass("active").siblings().removeClass("active");
            })

            $scope.setCookieinfo = function (name, lanveer) {
                $cookieStore.put(name, lanveer);
                $scope.loadData(1);
            }

            $scope.removeCookieinfo = function (name) {
                $cookieStore.remove(name);
                $scope.loadData(1);
            }

            $scope.loadData = function (page) {
                $resource("/blogs")
                    .get({
                        page: page,
                        pageSize: 5
                    }, function (data) {
                        $scope.blogs = data.result;
                        $scope.loadCount();
                    })
            }

            $cookieStore.remove("complete");
            $cookieStore.remove("type");

            $scope.loadCount = function () {
                $resource("/blogs/count")
                    .get(function (data) {
                        $scope.count = data.result;
                        if (data.err_code === 0) {
                            if ($scope.count.all <= 0) return false;
                            $("#pagination").twbsPagination({
                                totalPages: Math.ceil($scope.count.all / 5), // 告诉这个插件一共有多少页，它会自动帮你生成页码
                                visiblePages: 7, // 视图可见页码
                                first: '首页',
                                prev: '上一页',
                                next: '下一页',
                                last: '最后一页',
                                onPageClick: function (event, page) { // 当点击其中某个页码的时候要执行的回调处理函数，所谓的异步无刷新分页，本质上就是当点击某一页的时候，发起一个 ajax 异步请求，获取当前页码对应的数据，然后在客户端做渲染
                                    $scope.loadData(page);
                                }
                            });
                        }

                    })
            }

            $scope.loadData(1);
            $scope.loadCount();

            $scope.delete = function (id) {
                layer.confirm("确认要删除吗?", {icon: 3}, function () {
                    $resource("/blogs/:id", {id: id})
                        .delete(function (data) {
                            if (data.err_code === 0) {
                                $scope.loadData($("#pagination").twbsPagination("getCurrentPage"));
                            }
                            else {
                                layer.alert("删除失败", {
                                    icon: 2
                                });
                            }
                        });
                    layer.closeAll();
                });
            }
        }])
        .controller("imglistController", ["$scope", "$resource", function ($scope, $resource) {
            $scope.loadData = function (page) {
                $resource("/img")
                    .get({
                        page: page,
                        pageSize: 5
                    }, function (data) {
                        $scope.imgs = data.result;
                        $scope.loadCount();
                    })

            }
            $scope.loadCount = function () {
                $resource("/img/count")
                    .get(function (data) {
                        if (data.err_code === 0) {
                            if (data.result <= 0) return false;
                            $('#pagination').twbsPagination({
                                totalPages: Math.ceil(data.result / 5), // 告诉这个插件一共有多少页，它会自动帮你生成页码
                                visiblePages: 7, // 视图可见页码
                                first: '首页',
                                prev: '上一页',
                                next: '下一页',
                                last: '最后一页',
                                onPageClick: function (event, page) { // 当点击其中某个页码的时候要执行的回调处理函数，所谓的异步无刷新分页，本质上就是当点击某一页的时候，发起一个 ajax 异步请求，获取当前页码对应的数据，然后在客户端做渲染
                                    $scope.loadData(page);
                                }
                            });
                        }

                    })
            }

            $scope.loadData(1);
            $scope.loadCount();

            $scope.delete = function (id) {
                layer.confirm("确认要删除吗?", {icon: 3}, function () {
                    $resource("/img/:id", {id: id})
                        .delete(function (data) {
                            if (data.err_code === 0) {
                                $scope.loadData($("#pagination").twbsPagination("getCurrentPage"));
                            }
                            else {
                                layer.alert("删除失败", {
                                    icon: 2
                                });
                            }
                        });
                    layer.closeAll();
                });
            }
            $scope.getBase64 = function (index) {
                $("#hiddenText").text($scope.imgs[index].base64);
                $("#hiddenText").select();
                document.execCommand("Copy")
                layer.alert("已复制好，可贴粘。", {icon: 1});
            }

            $scope.getURL = function (index) {
                $("#hiddenText").text("http://www.lemonblog.xyz/static/upload_img/" + $scope.imgs[index].file);
                $("#hiddenText").select();
                document.execCommand("Copy")
                layer.alert("已复制好，可贴粘。", {icon: 1})
            }
        }])
        .controller("readController", ["$scope", "$routeParams", "$resource", function ($scope, $routeParams, $resource) {
            $resource("/blogs/markdown/:id", {id: $routeParams.id})
                .get(function (data) {
                    var rendererMD = new marked.Renderer();
                    marked.setOptions({
                        renderer: rendererMD,
                        gfm: true,
                        tables: true,
                        breaks: false,
                        pedantic: false,
                        sanitize: false,
                        smartLists: true,
                        smartypants: false
                    });

                    marked.setOptions({
                        highlight: function (code) {
                            return hljs.highlightAuto(code).value;
                        }
                    });

                    $scope.blog = data.blog;
                    $(".container").html(marked(data.data));
                })

        }])
        .controller("wizardController", ["$scope", "$http", function ($scope, $http) {
            $scope.word = "";
            $(function () {
                $("#wizard").steps({
                    headerTag: "h2",
                    bodyTag: "section",
                    transitionEffect: "slideLeft",
                    onFinishing: function () {
                        if ($(".blog_title").val() && $(".blog_name").val() && $(".blog_describe").val().length < 100 && /.(\.md)$/.test($("#filebtn").val())) {
                            return true;
                        } else {
                            layer.alert("信息输入错误,请检查!", {
                                icon: 2
                            })
                            return false;
                        }
                    },
                    onFinished: function () {
                        layer.load(0, {
                            shade: [0.3, '#000']
                        });
                        $.ajax({
                            url: "/blogs",
                            type: "post",
                            data: new FormData(this),
                            processData: false,
                            contentType: false,
                            success: function (data) {
                                layer.closeAll();
                                if (data.err_code === 0) {
                                    window.location.href = "/#!/bloglist";
                                } else {
                                    layer.alert("添加失败");
                                }
                            }
                        });
                    },
                    labels: {
                        finish: "提交",
                        next: "下一步",
                        previous: "上一步",
                    }
                });
                $(".describe_length").text(0)
                $(".blog_describe")[0].oninput = function () {
                    $(".describe_length").text(this.value.length)
                }

                $("#filebtn").change(function () {
                    var filename = $(this).val().split("\\").pop();
                    if (/.(\.md)$/.test(filename)) {
                        $(".fileItem").text(filename).css("color", "green");
                    } else {
                        $(".fileItem").text("请放入md文件 " + filename).css("color", "red");
                    }
                });

                $("#getbtn").click(function () {
                    $("#filebtn").click();
                });
            });
        }])
        .controller("editController", ["$scope", "$resource", "$routeParams", "$window", function ($scope, $resource, $routeParams, $window) {
            var simplemde = new SimpleMDE({
                element: $("#simplemde")[0],
                autoDownloadFontAwesome: false,
                autosave: {
                    enabled: true,
                    uniqueId: "MyUniqueID",
                    delay: 1000,
                },
                renderingConfig: {
                    singleLineBreaks: false,
                    codeSyntaxHighlighting: true
                }
            });

            $scope.flag = false;
            $scope.isSend = true;
            $resource("/blogs/markdown/:id", {id: $routeParams.id})
                .get(function (data) {
                    $scope.blog = data.blog;
                    $scope.markdown = data.data;
                });
            $scope.getfile = function () {
                $("#filebtn").click();
            }
            $scope.reset = function () {
                $scope.blog = null;
            }
            $scope.changeType = function () {
                $scope.isSend = !$scope.isSend;
            }
            $scope.insertMarkdown = function () {
                simplemde.value($scope.markdown);
            }

            $("#filebtn").change(function () {
                var filename = $(this).val().split("\\").pop();
                if (/.(\.md)$/.test(filename)) {
                    $scope.flag = true;
                    $(".fileItem").text(filename).css("color", "green");
                } else {
                    $(".fileItem").text("请放入md文件 " + filename).css("color", "red");
                }
            });

            $("#editForm").on("submit", function () {
                if ($scope.blog.title && $scope.blog.name && $scope.blog.describe.length < 100 && (/.(\.md)$/.test($("#filebtn").val()) || simplemde.value())) {
                    layer.load(0, {
                        shade: [0.3, '#000']
                    });
                    $.ajax({
                        url: "/blogs/edit",
                        type: "post",
                        data: new FormData(this),
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            layer.closeAll();
                            if (data.err_code === 0) {
                                $window.history.back();
                            } else {
                                layer.alert("添加失败");
                            }
                        }
                    });
                }
                else {
                    layer.alert("信息输入错误,请检查!", {
                        icon: 2
                    })
                    return false;
                }
                return false;
            })

        }])
        .controller("simplemdeController", ["$scope", "$http", function ($scope, $http) {

            var simplemde = new SimpleMDE({
                element: $("#simplemde")[0],
                autoDownloadFontAwesome: false,
                autosave: {
                    enabled: true,
                    uniqueId: "MyUniqueID",
                    delay: 1000,
                },
                renderingConfig: {
                    singleLineBreaks: false,
                    codeSyntaxHighlighting: true
                }
            });

            $scope.downloadFile = function () {
                $http({
                    url: "/blogs/build",
                    method: "post",
                    data: {markdown: simplemde.value()},
                }).then(function (result) {
                    var src = "/static/upload_md/" + result.data.result;
                    var $a = $("<a></a>").attr("href", src).attr("download", result.data.result);
                    $a[0].click();
                })
            }

        }])
        .controller("managerController", ["$scope", "$http", "FileUploader", function ($scope, $http, FileUploader) {
            var user = $scope.user = JSON.parse($.cookie("user"));
            $scope.portraitSrc = "/static/upload_img/" + user.portrait;
            var last_modified = (new Date().getTime() - user.last_modified) / (1000 * 60 * 60 );
            if (last_modified > 24) {
                $scope.last_modified = Math.floor(last_modified / 24) + "天前";
            } else {
                $scope.last_modified = "今天"
            }
            $scope.uploader = new FileUploader({
                url: "/getImg",
                queueLimit: 1,
                removeAfterUpload: true
            })
            $scope.uploader.onAfterAddingFile = function (fileItem) {
                $scope.fileItem = fileItem._file;
                $scope.uploader.uploadAll();
            };
            $scope.uploader.onSuccessItem = function (fileItem, response) {
                $scope.imgUrl = response.result;
                $("#_img").attr("src", $scope.imgUrl)
                $('#_img')
                    .cropper('destroy') // 初始化图片裁切之前先删除
                    .cropper({
                        aspectRatio: 9 / 9
                    })
            }
            $scope.cropper = function () {
                var data = $('#_img').cropper('getData');
                data.imgSrc = $('#_img').attr('src');
                $http({
                    url: "/cropper",
                    method: "post",
                    data: data
                }).then(function (data) {
                    if (data.data.err_code === 0) {
                        $("#newImg").attr("src", $scope.imgUrl)
                    }
                })
            }
            $scope.portrait = function () {
                $("#portrait").click();
            }
            $scope.register = function () {
                $.ajax({
                    url: "/register",
                    data: $("#mangerRegister").serialize(),
                    type: "post"
                }).then(function (data) {
                    if (data.err_code === 0) {
                        layer.alert("注册成功", {
                            icon: 1
                        })
                    } else if (data.err_code === 1) {
                        layer.alert("用户名被占用", {
                            icon: 3
                        })
                    } else {
                        layer.alert("注册失败", {
                            icon: 2
                        })
                    }
                })
            }


        }])
        .controller("classifyController", ["$scope", "$route", "$http", function ($scope, $route, $http) {
            $http.get("/classify").then(function (data) {
                $scope.classifies = data.data.result;
            })

            $scope.addClassify = function () {
                layer.open({
                    type: 1,
                    title: "添加分类",
                    skin: 'layui-layer-rim', //加上边框
                    area: ['320px', '100px'], //宽高
                    content: $("#classifyForm")
                });
            }
            $scope.sendClassify = function () {
                $.ajax({
                    url: "/classify",
                    type: "post",
                    data: $("#classifyForm").serialize()
                }).then(function (data) {
                    if (data.err_code === 0) {
                        layer.closeAll();
                        $route.reload();
                    } else if (data.err_code === 1) {
                        layer.alert("该分类已有")
                    }
                })

            }
            $scope.delete = function (id) {
                $http({
                    method: "delete",
                    url: "/classify",
                    params: {
                        id: id
                    }
                }).then(function (data) {
                    $route.reload();
                })
            }

        }])
        .controller("gameController", ["$scope", function ($scope) {
            $scope.fruit_ninja = function () {
                layer.open({
                    type: 2,
                    title: '水果忍者',
                    shadeClose: true,
                    shade: 0.8,
                    area: ['800px', '90%'],
                    content: '/static/game/fruit-ninja'
                });
            }
            $scope.mario = function () {
                layer.open({
                    type: 2,
                    title: '水果忍者',
                    shadeClose: true,
                    shade: 0.8,
                    area: ['800px', '90%'],
                    content: '/static/game/mario'
                });
            }
        }])
})(angular, $);