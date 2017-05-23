;(function () {
    angular
        .module("app")
        .config(["$routeProvider", function ($routeProvider) {
            $routeProvider
                .when("/", {
                    templateUrl: "home.html",
                })
                .when("/write", {
                    templateUrl: "note.html",
                })
                .when("/wizard", {
                    templateUrl: "wizard.html",
                    controller: "wizardController"
                })
                .when("/edit/:id", {
                    templateUrl: "edit.html",
                    controller: "editController"
                })
                .when("/simplemde", {
                    templateUrl: "simplemde.html",
                    controller: "simplemdeController"
                })
                .when("/bloglist", {
                    templateUrl: "bloglist.html",
                    controller: "bloglistController"
                })
                .when("/imglist", {
                    templateUrl: "imglist.html",
                    controller: "imglistController"
                })
                .when("/read/:id", {
                    templateUrl: "read.html",
                    controller: "readController"
                })
                .when("/base64", {
                    templateUrl: "base64.html"
                })
                .when("/addimg", {
                    templateUrl: "addimg.html"
                })
                .when("/manager", {
                    templateUrl: "manager.html",
                    controller: "managerController"
                })
                .when("/classify", {
                    templateUrl: "classify.html",
                    controller: "classifyController"
                })
                .when("/game", {
                    templateUrl: "game.html",
                    controller: "gameController"
                })
                .otherwise({
                    redirectTo: "/"
                });
        }]);

})();