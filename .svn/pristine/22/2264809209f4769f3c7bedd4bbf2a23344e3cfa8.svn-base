paipaiwang.factory("_Geo", function($rootScope, $window, $http,_Nofication) {
    return {
        getCurrentPosition: function() {
            $rootScope.located = false;
            var self = this;
            navigator.geolocation.getCurrentPosition(function(position){
                setTimeout(function(){
                    $rootScope.$apply(function(){
                        self.setLat("lat",position.coords.latitude);
                        self.setLng("lng",position.coords.longitude);
                        $http.jsonp("http://api.map.baidu.com/geocoder/v2/?ak=Nn6KEtPMmGsWm5eb6IG1EKGy&callback=JSON_CALLBACK&location="+position.coords.latitude+","+position.coords.longitude+"&output=json&pois=0").success(function(data){
                            self.setCity(data.result.addressComponent.city);
                        });
                        $rootScope.located = true;
                    });
                },500);
            },function(e){
                if (e.code == e.PERMISSION_DENIED) {
                    _Nofication.alert("定位失败，请打开手机定位服务！","无法定位","确定",function(){});
                    return;
                }
                if (e.code == e.POSITION_UNAVAILABLE) {
                    _Nofication.alert("暂时无法定位，请确保手机连接网络！","无法定位","确定",function(){});
                    return;
                }
                if (e.code == e.TIMEOUT) {
                    _Nofication.alert("定位超时，请重试！","无法定位","确定",function(){});
                    return;
                }

            },{maximumAge: 3000, timeout: 5000,enableHighAccuracy: true});
        },
        getDefaultPosition:function(){
            $http.get("remote-data/city_data.json", {
                cache: true
            }).success(function(data) {
                $window.localStorage.setItem("province", data.province);
                $window.localStorage.setItem("city", data.city);
                $window.localStorage.setItem("districts", JSON.stringify(data.districts));
                $window.localStorage.setItem("lat", data.lat);
                $window.localStorage.setItem("lng", data.lng);
            }).error(function(data, status, headers, config)  {
                _Nofication.alert("暂时无法定位，请确保手机连接网络！","无法定位","确定",function(){});
            });
        },
        get: function() {
            var geo = {
                city: $window.localStorage.getItem("city"),
                province: $window.localStorage.getItem("province"),
                districts: JSON.parse($window.localStorage.getItem("districts")),
                lat: $window.localStorage.getItem("lat"),
                lng: $window.localStorage.getItem("lng")
            };

            return geo;
        },
        setCity: function(city) {
            $window.localStorage.setItem("city", city);
        },
        setProvince:function(province) {
            $window.localStorage.setItem("province", province);
        },
        setDistrict:function(districts) {
            $window.localStorage.setItem("districts", districts);
        },
        setLat:function(lat) {
            $window.localStorage.setItem("lat", lat);
        },
        setLng:function(lng) {
            $window.localStorage.setItem("lng", lng);
        }
    }
});
paipaiwang.factory("_User", ["$window", "$cookieStore","$location","$route", function($window, cookies,$location,$route) {
    var user = {
        get: function() {
            return JSON.parse($window.localStorage.getItem("user"));
        },
        set: function(user) {
            this._cache(user);
        },
        _cache: function(user) {
            $window.localStorage.setItem("user", JSON.stringify(user));
        },
        login: function() {
            $location.path("/sign_in").replace();
        },
        isLogin: function() {
            return !!$window.localStorage.getItem("user");
        },
        exit: function() {
            $window.localStorage.removeItem("user");
            $route.reload();
        }
    };
    return user;
}]);
paipaiwang.factory("_CityCookie", ["$cookieStore", function(cookie) {
    var geo = {
        "city": cookie.get("city"),
        "lng": cookie.get("lng"),
        "lat": cookie.get("lat")
    }
    return geo;
}]);
// phonegap native interface injected to angular
paipaiwang.factory("_Nofication", function() {
    return {
        alert: function(message, title, buttonText, buttonAction) {
            navigator.notification.alert(message, buttonAction, title, buttonText);
        },
        confirm:function(message,title,buttonLabels,confirmCallback) {
            navigator.notification.confirm(message, confirmCallback, title, buttonLabels)
        }
    };
});
// event handler
paipaiwang.factory("_EventHandler",function($rootScope,$location,_Nofication,$route){
    var onBackKeyDown = function() {
        document.addEventListener("backbutton", onBackKeyDownHandler, false);
    }
    var onBackKeyDownHandler = function (e) {
        var exitRoute = ["/index","/nearby","/shopping_cart","/user"];
        if ( exitRoute.contains($location.path()) ) {
            navigator.app.exitApp();
            return;
        }
        $rootScope.$apply(function(){
            $rootScope.back(); 
        }); 
    }
    var onRequestError = function( data, status, headers, config ) {
        if ( config.timeout.$$state.value == "userCancel" ) {
            return;
        }
        switch( status ) {
            case 500:
            case 501:
            case 502:
            case 503:
            case 504:
            case 505:
            case 506:
            case 507:
            case 509:
            case 510:
                _Nofication.alert("服务器忙，请稍后再重试！","网络连接出错","确定",function(){});
                break;
            default:;
        }
        $rootScope.disableLoading();
        console.log("onRequestError output status, data, headers, config")
        console.log(status);
        console.log(data);
        console.log(headers)
        console.log(config);
        console.log("onRequestError end")
    }
    var onOffline = function () {
        document.addEventListener("offline",onOfflineHandler,false);
    }
    var onOfflineHandler = function (e) {
        $rootScope.$apply(function(){
            $rootScope.offline = true;
        });
    }
    var online = function() {
        $rootScope.$apply(function(){
            $rootScope.offline = false;
        });
    }
    var onProgress = function () {
        $rootScope.$on("$routeChangeStart",loading);
        $rootScope.$on("$routeChangeSuccess",loaded);
        $rootScope.$on("$routeChangeError",loadError);
    }
    var loading = function (e,currentRoute,prevRoute) {
        console.log("route change start");
        var currentRoute = currentRoute,
            prevRoute = prevRoute;
        if (currentRoute.$$route && currentRoute.$$route.resolve) {
            $rootScope.enableLoading();
        }
        angular.element(".overlay").unbind("click").bind("click",function(){
            $rootScope.$emit("cancelRequest");
            $rootScope.disableLoading();
        });
    }
    var loaded = function(e,currentRoute,prevRoute) {
            console.log("route change success")
            $rootScope.modal = "modal-out";
            $rootScope.overlay = "";
    }
    var loadError = function(e,currentRoute,prevRoute) {
        console.log("load error")
    }
    $rootScope.disableLoading = function(){
        $rootScope.modal = "modal-out";
        $rootScope.overlay = "";
        $rootScope.loading = "loading out";
    }
    $rootScope.enableLoading = function(){
        $rootScope.modal = "modal-in";
        $rootScope.overlay = "visible";
    }
    return {
        "onBackKeyDown":onBackKeyDown,
        "onRequestError":onRequestError,
        "onOffline":onOffline,
        "online":online,
        "onProgress":onProgress
    }
});
// check route
var checkAuthen = function($q, $rootScope, $location, $http, _Nofication,_User) {
    // online or offline check
    if ( $rootScope.offline ) {
        var deferred = $q.defer();
        deferred.reject();
        _Nofication.alert("手机未接入互联网，请联网后重试！","联网提示","确定",function(){});
        return deferred.promise;
    }
    // login check;
    if (_User.get()) {
        return true;
    } else {
        var deferred = $q.defer();
        $rootScope.slide = "slide-left";
        $location.path("/sign_in").replace();
        deferred.reject();
        
        return deferred.promise;
    }
};
var checkOffline = function($q, $rootScope, $location, $http, _Nofication,_User) {
    // online or offline check
    if ( $rootScope.offline ) {
        var deferred = $q.defer();
        deferred.reject();
        _Nofication.alert("手机未接入互联网，请联网后重试！","联网提示","确定",function(){});
        return deferred.promise;
    }
    return true;
};
// sync data from server 
paipaiwang.factory("_PPWModel",["$rootScope","$http","$q","$route","_EventHandler",function($rootScope,$http,$q,$route,_EventHandler){
    var ppwhttp = {
        fetch: function(method,url) {
            var url = url,
                method = method;
            if (url.split("local://").length > 1) {
                url = url.split("local://")[1];
            } else {
                url = $rootScope.host + url;
            }
            return function() {
                // query as param
                return function(query) {
                    var canceler = $q.defer(),
                        param = "";
                    //  param process
                    if (query && !angular.element.isEmptyObject(query) ) {
                        for (key in query){
                            param += key+"="+query[key]+"&";
                        }
                        param = param.substring(0,param.length-1);
                    }
                    url = url.split("?")[0];
                    // handle get request
                    if (method == "get" || method == "GET") {
                        if (param) {
                            url = url + "?" + param;
                        }
                        var promise = $http({method:"GET",url:url,cache:true,timeout:canceler.promise});
                    } 
                    // handle post request
                    else if (method == "post" || method == "POST") {
                        var promise = $http({method:"POST",url:url,data:data,cache:true,timeout:canceler.promise});
                    }
                    // promise success/error handle
                    promise.success(function(data,status,headers,config){
                        console.log("promise success")
                        $rootScope.loading = "loading out";
$rootScope.loaded = true;
                        return data;
                    }).error(function (data, status,headers,config) {
                        _EventHandler.onRequestError(data,status,headers,config);
                    });
                    $rootScope.$on("cancelRequest",function(){
                        console.log("user cancel");
                        canceler.resolve("userCancel");
                    })
                    return promise;
                }
            }
        }
    }
    // if post,at least {} pass as paramter
    ppwhttp.getBanners = ppwhttp.fetch("GET","app/Banner/all");
    // 购物车
    ppwhttp.getShoppingCart = ppwhttp.fetch("GET","app/Order/myShoppingCartList");
    ppwhttp.removeShoppingCartItem = ppwhttp.fetch("GET","app/Order/cancleOrders");
    ppwhttp.payShoppingCartItem = ppwhttp.fetch("GET","app/Order/buyProduct");
    ppwhttp.storeToShoppingCart = ppwhttp.fetch("GET","app/Order/addToShoppingCart");
    // 热卖商品
    ppwhttp.getHot = ppwhttp.fetch("GET","app/BaseProducts/hotProducts");
    ppwhttp.getProduct = ppwhttp.fetch("GET","app/BaseProducts/detail");
    ppwhttp.buyProduct = ppwhttp.fetch("GET","app/Order/buyProduct");
    // 分类换购
    ppwhttp.getCatalogs = ppwhttp.fetch("GET","app/BaseProducts/getSubCatalog");
    ppwhttp.getProductsByCatalog = ppwhttp.fetch("GET","app/BaseProducts/products");
    // 竞拍
    ppwhttp.getStartAuctions = ppwhttp.fetch("GET","app/Auction/getStartAuctionList");
    ppwhttp.getStartedAuctions = ppwhttp.fetch("GET","app/Auction/getStartedAuctionList");
    ppwhttp.getAuction = ppwhttp.fetch("GET","app/Auction/getDetail");
    ppwhttp.getAuctionOrder = ppwhttp.fetch("GET","local://remote-data/index.json");
    ppwhttp.getAuctionOrders = ppwhttp.fetch("GET","app/Auction/myAuctionProductList");
    ppwhttp.getAuctionComfirmInfo = ppwhttp.fetch("GET","app/AuctionProductInteraction/configAuctionProductOrder");
    ppwhttp.payAuction = ppwhttp.fetch("GET","app/AuctionProductInteraction/bid");
    // 幸运拍
    ppwhttp.getStartLuckyAuctions = ppwhttp.fetch("GET","app/Lucky/getStartLuckyList");
    ppwhttp.getStartedLuckyAuctions = ppwhttp.fetch("GET","app/Lucky/getStartedLuckyList");
    ppwhttp.getLuckyAuction = ppwhttp.fetch("GET","app/Lucky/getDetail");
    ppwhttp.getLuckyAuctionOrder = ppwhttp.fetch("GET","");
    ppwhttp.getLuckyAuctionOrders = ppwhttp.fetch("GET","app/Auction/myLuckyProductList");
    ppwhttp.getLuckyAuctionComfirmInfo = ppwhttp.fetch("GET","app/AuctionProductInteraction/configAuctionProductOrder");
    // 我的订单
    ppwhttp.getOrders = ppwhttp.fetch("GET","app/Order/getOrderList");
    ppwhttp.getOrder = ppwhttp.fetch("GET","local://remote-data/index.json");
    ppwhttp.cancleOrder = ppwhttp.fetch("GET","app/Order/cancleOrder");
    // ---收货
    ppwhttp.receiptOrder = ppwhttp.fetch("GET","local://remote-data/index.json");
    // ---退货
    ppwhttp.rejectOrder = ppwhttp.fetch("GET","local://remote-data/index.json");
    // ---物流
    ppwhttp.getTracking = ppwhttp.fetch("GET","local://remote-data/index.json");
    // ---兑现码
    ppwhttp.getExchangeCode = ppwhttp.fetch("GET","local://remote-data/index.json");
    // ---订单状态，退货状态
    ppwhttp.getOrderStatus = ppwhttp.fetch("GET","local://remote-data/index.json");
    // 省份、城市
    ppwhttp.getProvinces = ppwhttp.fetch("GET","local://remote-data/city/province.json");
    ppwhttp.getCities = ppwhttp.fetch("GET","local://remote-data/city/city.json");
    ppwhttp.getDistricts = ppwhttp.fetch("GET","local://remote-data/city/district.json");
    // 同城
    ppwhttp.getNearByStores = ppwhttp.fetch("GET","app/Nearby/getFranchiseeList");
    ppwhttp.getNearbyExchanges = ppwhttp.fetch("GET","app/Nearby/getLocalSwitchExperienceList");
    ppwhttp.getNearbyActivities = ppwhttp.fetch("GET","app/Nearby/getActivities");
    ppwhttp.getNearByHotStores = ppwhttp.fetch("GET","app/Nearby/getHotFranchisee");
    ppwhttp.getNearByStore = ppwhttp.fetch("GET","app/Nearby/getFranchisee");
    ppwhttp.getStoreGallery = ppwhttp.fetch("GET","app/Nearby/getFranchiseePictures");
    ppwhttp.getStoreExchange = ppwhttp.fetch("GET","app/Nearby/getLocalSwitchExperienceListOfFranchisee");
    ppwhttp.getStoreExchanges = ppwhttp.fetch("GET","app/Nearby/getLocalSwitchExperienceList");
    ppwhttp.getStoreExchangeDetail = ppwhttp.fetch("GET","app/Nearby/getLocalSwitchExperienceDetail");
    ppwhttp.getStoreExchangeInfo = ppwhttp.fetch("GET","app/Nearby/getFranchiseeFromLocalSwitchExperience");
    ppwhttp.getStoreComments = ppwhttp.fetch("GET","pp/Nearby/getCommentList");
    ppwhttp.leaveComment = ppwhttp.fetch("GET","app/Nearby/writeComment");
    // 个人资料
    ppwhttp.getUserInfo = ppwhttp.fetch("GET","app/Us/getUserInfo");
    ppwhttp.modifyPassword = ppwhttp.fetch("GET","local://remote-data/index.json");
    ppwhttp.checkPassword = ppwhttp.fetch("GET","local://remote-data/index.json");
    ppwhttp.getAddress = ppwhttp.fetch("GET","app/Address/getDetailAddress");
    ppwhttp.getAddresses = ppwhttp.fetch("GET","app/Address/getAddressList");
    ppwhttp.getFavours = ppwhttp.fetch("GET","app/Us/getMyCollet");
    ppwhttp.getRecords = ppwhttp.fetch("GET","app/Us/getBuyRecord");
    ppwhttp.getMessage = ppwhttp.fetch("GET","app/Message/list");
    ppwhttp.feedback = ppwhttp.fetch("GET","app/Us/addFeedback?feedback_info");
    // 登录
    ppwhttp.signIn = ppwhttp.fetch("GET","app/Login/in");
    ppwhttp.checkTelephone = ppwhttp.fetch("GET","app/Login/checkTelExist");
    ppwhttp.getValidateCode = ppwhttp.fetch("GET","app/Us/getIdentifyCode");
    ppwhttp.signUp = ppwhttp.fetch("GET","app/Login/register");
    ppwhttp.updatePassword = ppwhttp.fetch("GET","app/Us/updatePassword");
    // interface to expose
    var ppwmodel = {
        getBanners: ppwhttp.getBanners(),
        // 购物车
        getShoppingCart:ppwhttp.getShoppingCart(),
        removeShoppingCartItem: ppwhttp.removeShoppingCartItem(),
        payShoppingCartItem: ppwhttp.payShoppingCartItem(),
        stortToShoppingCart: ppwhttp.storeToShoppingCart(),
        // 热卖商品
        getHot: ppwhttp.getHot(),
        getProduct: ppwhttp.getProduct(),
        buyProduct: ppwhttp.buyProduct(),
        // 分类换购
        getCatalogs: ppwhttp.getCatalogs(),
        getProductsByCatalog: ppwhttp.getProductsByCatalog(),
        // 竞拍
        getStartAuctions: ppwhttp.getStartAuctions(),
        getStartedAuctions: ppwhttp.getStartedAuctions(),
        getAuction: ppwhttp.getAuction(),
        getAuctionOrder: ppwhttp.getAuctionOrder(),
        getAuctionOrders: ppwhttp.getAuctionOrders(),
        getAuctionComfirmInfo: ppwhttp.getAuctionComfirmInfo(),
        payAuction: ppwhttp.payAuction(),
        // 幸运拍
        getStartLuckyAuctions: ppwhttp.getStartLuckyAuctions(),
        getStartedLuckyAuctions: ppwhttp.getStartedLuckyAuctions(),
        getLuckyAuction: ppwhttp.getLuckyAuction(),
        getLuckyAuctionOrder: ppwhttp.getLuckyAuctionOrder(),
        getLuckyAuctionOrders: ppwhttp.getLuckyAuctionOrders(),
        getLuckyAuctionComfirmInfo: ppwhttp.getLuckyAuctionComfirmInfo(),
        // 我的订单
        getOrders: ppwhttp.getOrders(),
        getOrder: ppwhttp.getOrder(),
        cancleOrder: ppwhttp.cancleOrder(),
        // ---收货
        receiptOrder: ppwhttp.receiptOrder(),
        // ---退货
        rejectOrder:ppwhttp.rejectOrder(),
        // ---物流
        getTracking:ppwhttp.getTracking(),
        // ---兑现码
        getExchangeCode: ppwhttp.getExchangeCode(),
        // ---订单状态，退货状态
        getOrderStatus:ppwhttp.getOrderStatus(),
        // 省份、城市
        getProvinces: ppwhttp.getProvinces(),
        getCities: ppwhttp.getCities(),
        getDistricts: ppwhttp.getDistricts(),
        // 同城
        getNearByStores: ppwhttp.getNearByStores(),
        getNearbyExchanges: ppwhttp.getNearbyExchanges(),
        getNearbyActivities: ppwhttp.getNearbyActivities(),
        getNearByHotStores: ppwhttp.getNearByHotStores(),
        getNearByStore: ppwhttp.getNearByStore(),
        getStoreGallery: ppwhttp.getStoreGallery(),
        getStoreExchange: ppwhttp.getStoreExchange(),
        getStoreExchanges: ppwhttp.getStoreExchanges(),
        getStoreExchangeDetail: ppwhttp.getStoreExchangeDetail(),
        getStoreExchangeInfo: ppwhttp.getStoreExchangeInfo(),
        getStoreComments: ppwhttp.getStoreComments(),

        leaveComment: ppwhttp.leaveComment(),
        // 个人资料
        getUserInfo: ppwhttp.getUserInfo(),
        modifyPassword: ppwhttp.modifyPassword(),
        checkPassword: ppwhttp.checkPassword(),
        getAddress: ppwhttp.getAddress(),
        getAddresses: ppwhttp.getAddresses(),
        getFavours: ppwhttp.getFavours(),
        getRecords: ppwhttp.getRecords(),
        getMessage: ppwhttp.getMessage(),
        feedback: ppwhttp.feedback(),
        // 登录
        signIn: ppwhttp.signIn(),
        checkTelephone: ppwhttp.checkTelephone(),
        getValidateCode: ppwhttp.getValidateCode(),
        signUp: ppwhttp.signUp(),
        updatePassword: ppwhttp.updatePassword()

    };

    return ppwmodel;
}]);