;(function (angular) {
    angular
        .module("app")
        .filter("complete_filter", function () {
            return function (value) {
                if (value === "publish") {
                    return "已发布"
                } else if (value === "unpublish") {
                    return "未发布"
                } else if (value === "draft") {
                    return "废稿"
                }
            }
        })
        .filter("editType_filter", function () {
            return function (value) {
                if (value === true) {
                    return "在线编辑文件";
                } else {
                    return "重新上传文件"
                }
            }
        })
})(angular)