var indexController = function($scope, $http,_EventHandler,_PPWModel) {
    $scope.$parent.active = "index";
    $scope.pageName = "首页";
    _PPWModel.getBanners().then(function(data){
        $scope.banners = data.data.banners;
    },function(){});
    
};
var nearbyController = function($scope, $http, _Geo) {
    $scope.$parent.active = "nearby";
    $scope.pageName = "同城";
    $scope.city = _Geo.get().city;
};
var shoppingCartController = function($rootScope,$scope, $http,$location,_User,_Nofication,_EventHandler,_PPWModel) {
    $scope.$parent.active = "shopping_cart";
    $scope.pageName = "购物车";
    $scope.actionMenu = "编辑";
    _PPWModel.getShoppingCart({"user_id":_User.get().user_id}).then(function(data){
        $scope.items = data.data.shoppingCart;
    },function(){})
    $scope.sum = function() {
        var sum = 0;
        angular.forEach($scope.items, function(item) {
            sum += item.clearing ? item.orderPrice*item.total : 0;
        });
        return sum;
    }
    var flag = 0;
    $scope.all = function() {
        if (flag % 2 == 0) {

            angular.forEach($scope.items, function(item) {
                item.clearing = true;
            });
            $scope.total = true;
            flag++;
        } else {
            angular.forEach($scope.items, function(item) {
                item.clearing = false;
            });
            $scope.total = false;
            flag++;
        }
    }
    $scope.toggleAction = function() {
        if ($scope.actionMenu == '编辑') {
            $scope.actionMenu = '完成';
        } else {
            $scope.actionMenu = '编辑';
        }
    }
    $scope.removeItem = function() {
        var removeItems = [];
        var remainItems = $scope.items = $scope.items.filter(function(item) {
            if ( item.clearing ) {
                removeItems.push(item);
            }
            return !item.clearing;
        });
        $scope.items = remainItems;
        var orderIDS = removeItems.map(function(item){
            return item.id;
        }).join(",");
        PPWModel.removeShoppingCartItem({"user_id":_User.get().user_id,"order_ids":orderIDS}).then(function(data){
            _Nofication.alert("成功删除","删除购物车","确定",function(){});
        },function(){});
    }
    $scope.onConfirm = function(index) {
        if (index != 1) {
            return;
        }
        var orderID = $scope.buyableItem.map(function(item){
            return item.id;
        }).join(",");
        _PPWModel.payShoppingCartItem({"user_id":_User.get().user_id,"order_ids":orderID}).then(function(data){
            if ( data.status == 1 ) {
                $rootScope.slide = "slide-left";
                $rootScope.paymentStatus = "支付成功";
                $rootScope.paymentMessage = "支付成功";
            }else {
                $rootScope.paymentStatus = "支付失败";
                $rootScope.paymentMessage = "支付失败";
            }
            if ( data.status == -1 ) {
                $rootScope.paymentStatus = "支付失败";
                $rootScope.paymentMessage = "拍币不足";
            }
            $location.path("/payment").replace();
        });
    }
    $scope.buy = function () {
        $scope.buyableItem = [];
        angular.forEach($scope.items, function(item) {
            if (item.clearing) {
                $scope.buyableItem.push(item);
            }
        });
        if ( $scope.buyableItem.length == 0) {
            return;
        }
        _Nofication.confirm("确认结算将会扣除相应的拍币，是否扣除？","支付提示",["确定","取消"],$scope.onConfirm);
    }
};
var userController = function($scope, $http,_User) {
    $scope.$parent.active = "user";
    $scope.pageName = "个人中心";
    $scope.userProfile = _User.get();
};
var strategyController = function($scope, $http,_EventHandler) {
    $scope.pageName = "拍币策略";
};
var hotController = function($scope, $http, $rootScope,_EventHandler,_PPWModel) {
    $scope.pageName = "热门商品";
    _PPWModel.getHot().then(function(data){
        $scope.products = data.data.HotProducts;
    },function(){})
    
};
var auctionsController = function($scope,$rootScope, $http,_EventHandler,_PPWModel) {

    $scope.pageName = "竞拍";
    $scope.getStartAuctions = function(auction) {
        $rootScope.loading = "loading in";
$rootScope.loaded = false;
        _PPWModel.getStartAuctions().then(function(data){
            $scope.auctions = data.data.StartAuctionProductList.list;
        },function(){});
    }
    $scope.getStartedAuctions = function() {
        $rootScope.loading = "loading in";
$rootScope.loaded = false;
        _PPWModel.getStartedAuctions().then(function(data){
            $scope.auctions = data.data.StartedAuctionProductList.list;
        },function(){})
    }
    $scope.getTime = function (time) {
        return new Date(time).getTime();
    }
    $scope.getStartAuctions();
};
var auctionController = function($scope, $rootScope, $http, $routeParams,_EventHandler,_Auction) {

    $scope.pageName = "竞拍详情";
    $scope.auction = _Auction.data.auctionProduct;
    $scope.records = _Auction.data.record;

}
var auctionOrdersController = function($scope,$rootScope,$http,$routeParams,_User,_EventHandler,_PPWModel) {
    var status = {
        "0":"竞拍等待中",
        "1":"竞拍失败",
        "2":"竞拍成功",
        "3":"待发货",
        "4":"已发货",
        "5":"已支付"
    };
    $scope.pageName = "我的竞拍";
    $scope.getStatus = function (s) {
        return status[s];
    }
    _PPWModel.getAuctionOrders({"user_id":_User.get().user_id,"pageNum":1}).then(function(data){
        $scope.auctionOrders = data.data.myAuctionProduct.list;
        $scope.pageSize = data.data.myAuctionProduct.pageSize;
        $scope.pageNum = data.data.myAuctionProduct.pageNum;
        $scope.totalPage = data.data.myAuctionProduct.totalPage;    
    },function(){});
}
var auctionOrderController = function($scope, $http,_EventHandler,_AuctionOrder) {
    
    $scope.pageName = "订单详情";
    $scope.auctionOrder = _AuctionOrder.data
}
var auctionComfirmController = function($rootScope,$scope, $http,_EventHandler,_User,_PPWModel) {
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    var status = {
        "-1":"账户拍币不足",
        "0":"竞拍已经结束了",
        "1":"出价成功"
    }
    var price = $routeParams.price;
    _PPWModel.payAuction({"id":$routeParams.orderID,"user_id":_User.get().user_id,"price":price}).then(function(data){
        
        $scope.pageName = data.data.status == 1 ?"订单成功":"订单失败";
        $scope.auction = data.data;
        $scope.consumer = price;

    },function(){})
}
var auctionTrackController = function($scope, $http,_EventHandler) {
    $scope.pageName = "物流信息";
    $http.get("remote-data/auction_track.json", {
        cache: true
    }).success(function(data) {
        $scope.auctionTrack = data;
    }).error(function(data, status, headers, config) {
        _EventHandler.onRequestError(data, status, headers, config);
    });
}
var auctionPlaceController = function($scope, $http,_User,$rootScope,$routeParams,_EventHandler,_AuctionComfirmInfo) {
    $scope.pageName = "确认竞拍订单";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    var auctionID = $routeParams.auctionID;
    var userID = _User.get().user_id;
    $scope.product = _AuctionComfirmInfo.data.product;
    $scope.contact = _AuctionComfirmInfo.data.address;
    $scope.bid = _AuctionComfirmInfo.data.BidRecord;
    $scope.getDelivery = function(delivery){
        return delivery == 1 ? "包邮":"付费";
    }
}
var luckyAuctionsController = function($scope, $http, $rootScope,_EventHandler,_PPWModel) {

    $scope.pageName = "幸运拍";

    $scope.getStartLuckyList = function() {
        console.log("get start lucky")
        $rootScope.loading = "loading in";
$rootScope.loaded = false;
        _PPWModel.getStartLuckyAuctions().then(function(data){
            $scope.auctions = data.data.StartLuckyProductList.list;
        },function(){});
    }
    $scope.getStartedLuckyList = function() {
        $rootScope.loading = "loading in";
$rootScope.loaded = false;
        _PPWModel.getStartedLuckyAuctions().then(function(data){
            $scope.auctions = data.data.StartedLuckyProductList.list;
        },function(){});
    }
    $scope.getEndTime = function(endtime) {
        return new Date(endtime).getTime();
    }
    $scope.getStartedLuckyList();
};
var luckyAuctionController = function($scope,$http,$rootScope,_EventHandler,_LuckyAuction) {
    $scope.pageName = "幸运拍详情";
    $scope.auction = _LuckyAuction.data.luckyProduct;
    $scope.records = _LuckyAuction.data.record;
}
var luckyAuctionPlaceController = function($scope, $http,_User,$rootScope,$routeParams,_EventHandler,_LuckyAuctionComfirmInfo) {
    $scope.pageName = "确认幸运拍订单";

    $scope.product = _LuckyAuctionComfirmInfo.data.product;
    $scope.contact = _LuckyAuctionComfirmInfo.data.address;
    $scope.bid = _LuckyAuctionComfirmInfo.data.BidRecord;
    $scope.getDelivery = function(delivery){
        return delivery == 1 ? "包邮":"付费";
    }
}
var luckyAuctionOrdersController = function($scope,$rootScope,$http,$routeParams,_User,_EventHandler,_PPWModel) {
    _User._cache({
        "id":28,
        "username:":"dribehance"
    })
    var status = {
        "0":"竞拍等待中",
        "1":"竞拍失败",
        "2":"竞拍成功",
        "3":"待发货",
        "4":"已发货",
        "5":"已支付"
    };
    $scope.pageName = "我的幸运拍竞拍";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    $scope.user = _User.get();
    var userID = $scope.user.id;
    _PPWModel.getLuckyAuctionOrders({"user_id":_User.get().user_id,"pageNum":1}).then(function(data){
        $scope.auctionOrders = data.data.myLuckyProduct.list;
        $rootScope.loading = "loading out";
$rootScope.loaded = true;
        $scope.pageSize = $scope.auctionOrders.pageSize;
        $scope.pageNum = $scope.auctionOrders.pageNum;
        $scope.totalPage = $scope.auctionOrders.totalPage;
    },function(){});
    $scope.getStatus = function (s) {
        return status[s];
    }
}
var luckyAuctionOrderController = function($scope, $http,_PPWModel) {
    $scope.pageName = "订单详情";
    _PPWModel.getLuckyAuctionOrder().then(function(data){
        $scope.auctionOrder = data;
    },function(){});
}
var chargeController = function($rootScope,$scope, $http,_EventHandler,$routeParams,$location) {
    $scope.pageName = "话费充值";
    $scope.meta = {};
    if ($rootScope.TEL) {
        $scope.meta.telephone = $rootScope.TEL;
    }
    $scope.charge = function () {
        if ( !checkTelephone($scope.meta.telephone) ) {
            $scope.err = true;
            $scope.errTelMessage = "请输入合法的手机号，非空的合法11位手机号！";
            return;
        }
        $scope.err = false;
        $rootScope.TEL = $scope.meta.telephone;
        var remoteData = "/charge_comfirm/"+$scope.meta.money+"/"+$scope.meta.telephone;
        $rootScope.slide = "next";
        $location.path(remoteData);

    }
    var checkTelephone = function (telephone) {
        return /^1[3|4|5|8][0-9]\d{8}$/.test(telephone);
    }
};
var chargeComfirmController = function($scope, $http,_EventHandler,$routeParams) {
    $scope.pageName = "订单确认";

    $scope.money = $routeParams.money;
    $scope.telephone = $routeParams.telephone;
};
var chargeReachController = function($scope, $http,_EventHandler,$routeParams,$sce) {
    $scope.pageName = "充值确认";

    $scope.money = $routeParams.money;
    $scope.telephone = $routeParams.telephone;
    $scope.payment = $routeParams.payment;
    $scope.temp = "http://wap.007ka.cn/order_html.php?amount="+$scope.money+"&mob="+$scope.telephone+"&remob="+$scope.telephone+"";
    $scope.to = $sce.trustAsResourceUrl($scope.temp)
};
var welfareController = function($scope, $http,_EventHandler) {
    $http.get("remote-data/index.json").success(function(data) {
        $scope.home = data;
        $scope.content = " i am welfare";
    }).error(function(data, status, headers, config)  {
        _EventHandler.onRequestError(data, status, headers, config);
    });
};
var ordersController = function($rootScope,$scope, $route,$http,_User,_EventHandler,$location,_Nofication,_PPWModel) {
    $scope.pageName = "全部订单";
    $scope.orderStatus = "";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    var userID = _User.get().user_id;
    _PPWModel.getOrders({"user_id":_User.get().user_id}).then(function(data){
        $scope.orders = data.data.orders;
    },function(){});
    $scope.orderReach = function() {
        console.log("order reach")
    }
    $scope.orderCancel = function(orderID) {
        // var remoteData = $rootScope.host + "app/Order/cancleOrder?user_id="+userID+"&order_id="+orderID;
        var remainOrders = $scope.orders.filter(function(order) {
            return order.id != orderID;
        });
        $scope.orders = remainOrders;
        _PPWModel.cancleOrder({"user_id":userID,"order_id":orderID});
    }
    $scope.onConfirm = function(index) {
        if (index != 1) {
            return;
        }
        _PPWModel.payOrder({"user_id":_User.get().user_id,"order_id":$scope.orderID}).then(function(data){
            if ( data.status == 1 ) {
                $rootScope.slide = "slide-left";
                $rootScope.paymentStatus = "支付成功";
                $rootScope.paymentMessage = "支付成功";
            }else {
                $rootScope.paymentStatus = "支付失败";
                $rootScope.paymentMessage = "支付失败";
            }
            if ( data.status == -1 ) {
                $rootScope.paymentStatus = "支付失败";
                $rootScope.paymentMessage = "拍币不足";
            }
            $location.path("/payment").replace();
        },function(){});
    }
    $scope.buy = function (orderID) {
        $scope.orderID = orderID;
        _Nofication.confirm("确认结算将会扣除相应的拍币，是否扣除？","支付提示",["确定","取消"],$scope.onConfirm);
    }
};
var orderController = function($rootScope,$scope, $http,_User,_EventHandler,_PPWModel) {
    $scope.pageName = "订单详情";
    _PPWModel.getOrder({"user_id":_User.get().user_id}).then(function(data){
        $scope.order = data.data
    },function(){});
};
var orderReturnController = function($scope,_PPWModel) {
    $scope.pageName = "退货申请";
    $scope.rejectOrder = function () {
        _PPWModel.rejectOrder();
    }
};
var orderTrackController = function($scope, _PPWModel) {
    $scope.pageName = "订单物流";
    $scope.getTracking = function () {
        _PPWModel.getTracking();
    }
};
var orderStateController = function($scope, _PPWModel) {
    $scope.pageName = "订单状态";
    _PPWModel.getOrderStatus().then(function(data){
        $scope.orderStatus = data.data.status;
    },function(){});
};
var orderComfirmController = function($scope, _PPWModel) {
    $scope.pageName = "订单确认";
    $scope.receiptOrder = function (){
        _PPWModel.receiptOrder();
    }
};
var orderExchangeController = function($scope, _PPWModel) {
    $scope.pageName = "兑换码";
    $scope.exchangeCode = _PPWModel.getExchangeCode();
};
var productController = function($scope, $http, $rootScope, $routeParams,_Nofication,_User,_EventHandler,_PPWModel) {
    var limit = 10;
    $scope.pageName = "商品详情";
    $scope.footer = true;
    
    _PPWModel.getProduct({"id":$routeParams.productID}).then(function (data) {
        $scope.product = data.data.product;
        $scope.records = data.data.record;
        $scope.brand = data.data.brand;
        $scope.comments = data.data.comment;
        
        $scope.product.color = 'black';
        $scope.product.size = 'S';
        $scope.product.amount = 1;

    },function(){});

    $scope.getArray = function(n) {
        return new Array(n);
    };
    $scope.pushToCart = function() {
        if (!_User.isLogin()) {
            _Nofication.alert("需要登录才能够使用购物车功能","购物提示","确定",function(){});
            return;
        }
        $scope.shoppingAction = "toCart";
        $scope.slideUp = 'active';
        $scope.footer = false;
    }
    $scope.goBuy = function() {
        if (!_User.isLogin()) {
            _Nofication.alert("需要登录才能够使用购物车功能","购物提示","确定",function(){});
            return;
        }
        $scope.shoppingAction = "toBuy";
        $scope.slideUp = 'active';
        $scope.footer = false;
    }
    $scope.close = function() {
        $scope.slideUp = '';
        $scope.footer = true;
    }
    $scope.storeToCart = function() {
        $scope.slideUp = '';
        $scope.footer = true;
        _PPWModel.storeToShoppingCart({"user_id":_User.get().user_id,"product_id":$scope.product.id,"total":$scope.product.amount,"price":$scope.product.price}).then(function(data){
            if(data.data.status) {
                _Nofication.alert("成功加入购物车","购物提示","确定",function(){});                
            }
        },function(){});
    }
    $scope.buy = function() {
        _PPWModel.buyProduct({"user_id":_User.get().user_id,"order_id":orderID});
    }
    $scope.amountMinus = function() {
        $scope.product.amount--;
        if ($scope.product.amount < 1) {
            $scope.product.amount = 1;
        }
    }
    $scope.amountPlus = function() {
        $scope.product.amount++;
        if ($scope.product.amount > limit) {
            $scope.product.amount = limit;
        }
    }

};
var paymentController = function($scope,$rootScope) {
    $scope.pageName = $rootScope.paymentStatus ? $rootScope.paymentStatus:"订单支付";
    $scope.paymentMessage = $rootScope.paymentMessage;
};
var catalogsController = function($rootScope, $scope,_PPWModel) {
    var catalogs = {
        "woman": "女人装扮",
        "man": "男人装扮",
        "baby": "妈咪宝贝",
        "digital": "手机数码",
        "office": "家电办公",
        "jewelry": "美妆珠宝",
        "food": "食品百货",
        "outdoor": "运动户外",
        "furniture": "家装家饰"
    }
    $scope.pageName = "分类换购";

    $scope.catalog = "woman";

    $scope.getClothes = function(cloth) {
        $rootScope.loading = "loading in";
$rootScope.loaded = false;
        _PPWModel.getCatalogs({"catalog":catalogs[cloth]}).then(function(data){
            $scope.catalogs = data.data.subCatalogs;
            $scope.catalogName = catalogs[cloth];
        },function(){});
    }
    $scope.getClothes("woman");
};
var catalogController = function($rootScope, $scope, $http, $routeParams,_PPWModel) {

    $scope.pageName = $routeParams.catalogName;
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getProductsByCatalog({"catalogID":$routeParams.catalogID}).then(function(data){
        $scope.products = data.data.products;
        $rootScope.loading = "loading out";
$rootScope.loaded = true;
    },function(){});
}
var provincesController = function ($http,$rootScope,$scope,_Geo,_PPWModel){
    $scope.pageName = "选择省份";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getProvinces().then(function(data){
        $scope.provinces = data.data.province;
    },function(){});
    _Geo.getCurrentPosition();
    $scope.getCity = function () {
        return _Geo.get().city;
    }
}
var citiesController = function ($http,$rootScope,$scope,_Geo,$routeParams,_PPWModel){
    $scope.pageName = "选择城市";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    var province = $routeParams.province,
        directly = ["北京市","天津市","重庆市","上海市"],
        isDirectly = directly.contains(province),
        districtKey = province;

    _Geo.setProvince(province);
    _PPWModel.getCities().then(function(data){
        if ( isDirectly ) {
            $scope.cities = new Array(province);
        }else {
            $scope.cities = data[province];
        }
    },function(){});

    $scope.getDistricts = function(city){
        
        if ( isDirectly ) {
            _PPWModel.getCities().then(function(data){
                districtKey = city;
                _Geo.setDistrict(JSON.stringify(data[city]));
            },function(){})
        }else {
            _PPWModel.getDistricts().then(function(data){
                districtKey = province + city;
                _Geo.setDistrict(JSON.stringify(data[districtKey]));
            },function(){});
        }
        _Geo.setCity(city);
        $rootScope.slide = "fadeIn";
        $location.path("/nearby").replace();
    }
    $scope.getCity = function () {
        return _Geo.get().city;
    }

}
var nearbyStoresController = function($window, $scope, $rootScope, $http, $routeParams, _Geo) {
    $scope.pageName = "附近加盟店";
};
var nearbyExchangesController = function($window, $scope, $rootScope, $http, $routeParams, _Geo,_EventHandler,_PPWModel) {

    $scope.pageName = "同城换购体验";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    var geo = _Geo.get();
    _PPWModel.getNearbyExchanges().then(function(data){
        $scope.stores = data.data.LocalSwitchExperienceList.list;
    },function(){});
    $scope.switchCity = function(city) {
        $rootScope.back();
    }
};
var nearbyActivityController = function($scope, $rootScope,_Geo,_PPWModel) {

    $scope.pageName = "附近活动";
    var geo = _Geo.get();
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getNearbyActivities({"lat":geo.lat,"lng":geo.lng,"city":geo.city}).then(function(data){
        $scope.activities = data.data.activities.list;
    },function(){});
};
var nearbyHotStoreController = function($window, $scope, $rootScope, $http, $routeParams,_Geo,_EventHandler,_PPWModel) {

    $scope.pageName = "同城热门店铺";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    var geo = _Geo.get();
    _PPWModel.getNearbyHotStores({"lat":geo.lat,"lng":geo.lng,"city":geo.city,"pageNum":1}).then(function(data){
        $scope.stores = data.data.hot_franchisee.list;
        $scope.pageSize = $scope.stores.pageSize;
        $scope.pageNum = $scope.stores.pageNum;
        $scope.totalPage = $scope.stores.totalPage;
    },function(){})
    $scope.getArray = function(n) {
        return new Array(n);
    }
};
var nearbyStoreController = function($scope, $rootScope, $http, $routeParams, _Geo,_PPWModel) {

    
    $scope.conditions = {
        "type": "所有",
        "street": "全城",
        "order_type": "0"
    }
    $scope.orderType = {
        0:'离我最近',
        1:'评价最高',
        2:'人气最高',
        3:'最新发布',
        4:'智能排序'
    }
    var geo = _Geo.get();
    $scope.pageName = $routeParams.catalogName;
    $scope.districts = geo.districts;
    var current = '';
    $scope.toggle = function(condition) {
        if (current == condition) {
            $scope.condition = current = '';
        } else {
            $scope.condition = current = condition;
        }
    }
    $scope.fetch = function() {
        $scope.toggle('');
        $rootScope.loading = "loading in";
$rootScope.loaded = false;
        _PPWModel.getNearbyStores({"catalog":$routeParams.catalogName,"type":$scope.conditions.type,"street":$scope.conditions.street,"orderType":$scope.conditions.order_type,"lat":geo.lat,"lng":geo.lng,"city":geo.city,"pageNum":1}).then(function(data){
            $scope.stores = data.data.franchiseeList;
            $scope.pageSize = $scope.stores.pageSize;
            $scope.pageNum = $scope.stores.pageNum;
            $scope.totalPage = $scope.stores.totalPage;
        },function(){});

    }
    $scope.getArray = function(n) {
        return new Array(n);
    };
    $scope.fetch();

};
var storeController = function($scope, $rootScope, $http, $routeParams, _Geo) {

    $scope.pageName = "店铺详情";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    $scope.storeID = $routeParams.storeID;
    var geo = _Geo.get();
    _PPWModel.getNearbyStore({"id":$scope.storeID,"lat":geo.lat,"lng":geo.lng}).then(function(data){
        $scope.store = data.data.franchisee;
        $scope.comment = data.data.franchisee_comment_first.list[0];

        // page info
        $scope.pageSize = data.data.franchisee_comment_first.pageSize;
        $scope.pageNum = data.data.franchisee_comment_first.pageNum;
        $scope.totalPage = data.data.franchisee_comment_first.totalPage;

        $scope.totalItem = parseInt($scope.totalPage) * parseInt($scope.pageSize);
    },function(){});
    $scope.getArray = function(n) {
        return new Array(n);
    };

};
var storeGalleryController = function($scope, $rootScope, $routeParams,_PPWModel) {

    $scope.pageName = "店铺相册";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getStoreGallery({"franchisee_id":$routeParams.storeID}).then(function(data){
        $scope.pictures = data.data.pictures;
    },function(){});

};
var storeExchangeController = function($scope, $rootScope,$routeParams,_PPWModel) {

    $scope.pageName = "店铺产品换购体验";
    $scope.storeID = $routeParams.storeID;
    _PPWModel.getStoreExchange({"franchisee_id":$routeParams.storeID}).then(function(data){
        $scope.exchanges = data.data.LocalSwitchExperienceListOfFranchisee.list;
    },function(){});

};
var storeExchangesController = function($scope, $rootScope,$routeParams,_PPWModel) {

    $scope.pageName = "店铺产品换购体验列表";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getStoreExchanges({"franchisee_id":$routeParams.storeID}).then(function(data){
        $scope.stores = data.data.LocalSwitchExperienceList.list;
    },function(){});
    $scope.switchCity = function(city) {
        $rootScope.back();
    }
};
var storeExchangeDetailController = function($scope, $rootScope,$routeParams,_EventHandler) {

    $scope.pageName = "换购详情";
    $scope.storeID = $routeParams.storeID;
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getStoreExchangeDetail({"id":$routeParams.storeID}).then(function(data){
        $scope.detail = data.data.localSwitchExperience;
    },function(){});
};
var storeExchangeInfoController = function($scope, $rootScope,$routeParams,_EventHandler) {

    $scope.pageName = "换购";
    $routeParams.loaded = false;
    _PPWModel.getStoreExchangeInfo({"franchisee_id":$routeParams.storeID,"id":$routeParams.targetID}).then(function(data){
        // exchange info
        $scope.exchange = data.data.LocalSwitchExperience;
        // comments 
        $scope.comments = data.data.franchisee_comment_first.list[0];
        // page info
        $scope.pageSize = data.data.franchisee_comment_first.pageSize;
        $scope.pageNum = data.data.franchisee_comment_first.pageNum;
        $scope.totalPage = data.data.franchisee_comment_first.totalPage;

        $scope.totalItem = parseInt($scope.totalPage) * parseInt($scope.pageSize);
        // store info
        $scope.store = data.data.franchisee;
    },function(){});

};
var storeCommentsController = function($scope, $rootScope,$routeParams,_PPWModel) {

    $scope.pageName = "店铺评论";
    $scope.storeID = $routeParams.storeID;
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getStoreComments({"franchisee_id":$routeParams.storeID,"pageNum":1}).then(function(data){
        $scope.comments = $scope.franchisee_comments.list;
        $scope.pageSize = data.data.comments.pageSize;
        $scope.pageNum = data.data.comments.pageNum;
        $scope.totalPage = data.data.comments.totalPage;
    },function(){});
    $scope.getArray = function(n) {
        return new Array(n);
    };


};
var commentController = function($scope, $rootScope,$routeParams, $location, _User,_PPWModel) {

    $scope.pageName = "评论";
    $scope.comment = {
        content: "555"
    };
    $scope.stars = 1;
    $scope.submit = function() {
        if (!_User.isLogin()) {
            $scope.warning = true;
            return;
        }
        $scope.warning = false;
        _PPWModel.leaveComment({"user_id":_User.get().user_id,"franchisee_id":$routeParams.targetID,"star":2,"content":$scope.comment.content}).then(function(data){
            if (data.status) {
                alert("评论成功");
                $rootScope.slide = "fadeIn";
                $location.path("/");
            }
        },function(){})
    }

};
var exchangePlaceController = function($window, $scope, $rootScope, $http, $routeParams,$location,_EventHandler) {

    $scope.pageName = "确认订单";
    $scope.exchange = {
        title:"",
        cover:"",
        price:"",
        quantity: 1,
        total:0
    }
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    var limit = 10,
        exchangeID = $routeParams.exchangeID,
        remoteData = $rootScope.host + "";
    $http.get(remoteData).success(function(data){
        $scope.exchange.title = data.data.title;
        $scope.exchange.cover = data.data.cover;
        $scope.exchange.price = data.data.price;
        $scope.exchange.total = parseInt($scope.exchange.price) * parseInt($scope.exchange.quantity);
    }).error(function(data, status, headers, config) {
        _EventHandler.onRequestError(data, status, headers, config);
    })
    // on submit;
    $scope.submit = function () {
        var postData = $rootScope.host + "";
        $http.get(postData).success(function(data){
            
            if ( data.status ) {
                $rootScope.slide = "jump";
                $location.path("/payment");
            }
        }).error(function(data, status, headers, config) {
            _EventHandler.onRequestError(data, status, headers, config);
        });
    }
    $scope.amountMinus = function() {
        $scope.amount--;
        if ($scope.amount < 1) {
            $scope.amount = 1;
        }
    }
    $scope.amountPlus = function() {
        $scope.amount++;
        if ($scope.amount > limit) {
            $scope.amount = limit;
        }
    }

};
var personalInfoController = function($scope, $rootScope,_User,_PPWModel) {

    $scope.pageName = "个人资料";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getUserInfo({"user_id":_User.get().user_id}).then(function(data){
        $scope.user = data.data.UserInfo;
    },function(){});
    $scope.save = function () {
        $rootScope.back();
    }
};
var modifyPasswordController = function($window, $scope, $rootScope, $http, $routeParams,_Nofication,_EventHandler) {

    $scope.pageName = "修改密码";
    $scope.signProfile = {
        "oldPassword":"",
        "newPassword":"",
        "newPasswordAgain":""
    }
    $scope.checked = false;
    $scope.modify = function() {
        $scope.check(function(){
            if ( !($scope.newPassword && $scope.newPasswordAgain )) {
                _Nofication.alert("请输入要修改的密码","修改提示","确定",function(){});
                return;
            }
            if ( $scope.newPassword != $scope.newPasswordAgain ) {
                _Nofication.alert("两次输入的密码不相同","修改提示","确定",function(){});
                return;
            }
            _PPWModel.modifyPassword().then(function(data){
                _Nofication.alert("密码修改成功","修改提示","确定",function(){
                    $scope.$apply(function(){
                        $rootScope.back();
                    });
                });
            },function(){});
        });
    }
    $scope.check = function(callback) {
        _PPWModel.checkPassword();
    }

};
var addressController = function($scope, $rootScope, $routeParams,_PPWModel) {

    $scope.pageName = "地址详情";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getAddress({"id":$routeParams.addressID}).then(function(data){
        $scope.address = data.data.address;
    },function(){});
    _PPWModel.getProvinces().then(function(data){
        $scope.provinces = data.data.province;
    },function(){});

};
var addressesController = function($scope,_User,_PPWModel) {

    $scope.pageName = "收货地址";
    $scope.defaultAddress = -1;
    _PPWModel.getAddresses({"user_id":_User.get().user_id}).then(function(data){
        $scope.addresses = data.data.addressList;
    },function(){});

};
var addressNewController = function($scope) {

    $scope.pageName = "新增收货地址";

};
var moreController = function($scope,_User) {

    $scope.pageName = "更多";
    $scope.exit = function() {
        _User.exit();
    }

};
var favourController = function($scope, $rootScope,_User,_PPWModel) {
    $scope.pageName = "我的收藏";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getFavours({"user_id":_User.get().user_id}).then(function(data){
        $scope.favours = data.data.MyCollects.list;
        $scope.pageSize = data.data.MyCollects.pageSize;
        $scope.pageNumber = data.data.MyCollects.pageNumber;
        $scope.totalPage = data.data.MyCollects.totalPage;
    },function(){});
};
var recordController = function($scope, $rootScope,_User,_PPWModel) {
    $scope.pageName = "消费记录";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    _PPWModel.getRecords({"user_id":_User.get().user_id}).then(function(data){
        $scope.records = data.data.list;
    },function(){});

};
var messageController = function($scope, $rootScope,_User,_PPWModel) {

    $scope.pageName = "消息中心";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    var userID = _User.get().user_id;
    _PPWModel.getMessage().then(function(data){
        $scope.messages = data.data.messages.list;
    },function(){});

};
var feedbackController = function($scope, $rootScope,_User,_PPWModel) {

    $scope.pageName = "意见反馈";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    $scope.feedback = "";
    var userID = _User.get().user_id;
    $scope.feedback = function() {
        $rootScope.loading = "loading in";
$rootScope.loaded = false;
        _PPWModel.feedback({"user_id":_User.get().user_id,"feedback_info":$scope.feedback}).then(function(data){
            if ( data.status ) {
                _Nofication.alert("感谢您的反馈，我们将竭诚为您服务","反馈提示","确定",function(){
                    $scope.$apply(function(){
                        $rootScope.back();
                    });
                });
                return;
            }
            _Nofication.alert("服务器忙,请重新提交","反馈提示","确定",function(){});
        },function(){});
    }

};
var signInController = function ($scope,$rootScope,$location,_User,_Nofication,_PPWModel) {
    if ( _User.get() ) {
        $location.path("/user").replace();
        return;
    }
    $scope.pageName = "登录";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    $scope.signProfile = {
        "username":"",
        "password":""
    }
    $scope.signIn = function() {

        if ( !( $scope.signProfile.username && $scope.signProfile.password )) {
            _Nofication.alert("请输入登录信息再登录","错误提示","确定",function(){});
            return;
        }
        $rootScope.loading = "loading out";
$rootScope.loaded = true;
        _PPWModel.signIn({"username":$scope.signProfile.username,"password":$scope.signProfile.password}).then(function(data){
            if ( !(data.status == 1)) {
                $rootScope.loading = "loading in";
$rootScope.loaded = false;
                _Nofication.alert("用户名密码不正确","错误提示","确定",function(){});
                return;
            }
            _User.set(data.user);
            $location.path("/index").replace();
        },function(){});
    }
}
var signUpController = function ($scope,$rootScope,_User,_Nofication,$timeout,_PPWModel) {
    $scope.pageName = "注册";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    $scope.fetching = false;
    $scope.signing = false;
    $scope.userExist = false;
    $scope.step = 1;
    $scope.signProfile = {
        "telephone":"",
        "passwordInit":"",
        "passwordAgain":"",
        "vertifyCode":""
    };
    $scope.getCode = function() {
        if ( !checkTelephone($scope.signProfile.telephone) ) {
            _Nofication.alert("请确保输入正确的手机号码","错误提示","确定",function(){});
            return;
        }
        $scope.fetching = true;
        _PPWModel.checkTelephone({"telephone":$scope.signProfile.telephone}).then(function(data){
            $scope.fetching = false;
            if (data.status == 1) {
                $scope.userExist = true;
            }
            if (data.status == 0 ) {
                $scope.manualGet();
            }
        },function(){});
        $timeout(function(){
            $scope.fetching = false;
        },30000);
    }
    $scope.setPassword = function () {
        if ( !$scope.signProfile.vertifyCode || ($scope.signProfile.vertifyCode != $scope.remoteCode )) {
            _Nofication.alert("请确保输入正确的手机验证码","错误提示","确定",function(){});
            return;
        }
        $rootScope.loading = "loading out";
$rootScope.loaded = true;
        $scope.pageName = "设置密码";
        $scope.step = 3;
    }
    // 手动获取验证码
    $scope.manualGet = function() {
        $scope.fetching = true;
        _PPWModel.getValidateCode({"telephone":$scope.signProfile.telephone}).then(function(data){
            $scope.fetching = false;
            $scope.pageName = "获取验证码";
            $scope.step = 2;
            $scope.remoteCode = data.data.code;
        },function(){});
    }
    $scope.signUp = function () {
        if ( !$scope.signProfile.passwordInit || !$scope.signProfile.passwordAgain) {
            _Nofication.alert("密码不能为空","错误提示","确定",function(){});
            return;
        }
        if ( $scope.signProfile.passwordInit != $scope.signProfile.passwordAgain) {
            _Nofication.alert("两次输入的密码不相同","错误提示","确定",function(){});
            return;
        }
        $scope.signing = true;
        _PPWModel.signUp({"telephone":$scope.signProfile.telephone,"password":$scope.signProfile.password}).then(function(data){
            $scope.signing = false;
            _User.set("user",data.user);
            $location.path("/user").replace();
        },function(){});
    }
    var checkTelephone = function (telephone) {
        return /^1[3|4|5|8][0-9]\d{8}$/.test(telephone);
    }
}
var forgetController = function ($window,$scope,$rootScope,$http,$location,_Nofication,_EventHandler,$timeout,_User) {
    $scope.pageName = "忘记密码";
    $rootScope.loading = "loading in";
$rootScope.loaded = false;
    $scope.fetching = false;
    $scope.step = 1;
    $scope.signing = false;
    $scope.userExist = true;
    $scope.signProfile = {
        "telephone":"",
        "passwordInit":"",
        "passwordAgin":"",
        "vertifyCode":""
    };
    $scope.getCode = function() {
        if ( !checkTelephone($scope.signProfile.telephone) ) {
            _Nofication.alert("请确保输入正确的手机号码","错误提示","确定",function(){});
            return;
        }
        $scope.fetching = true;
        _PPWModel.checkTelephone({"telephone":$scope.signProfile.telephone}).then(function(data){
            $scope.fetching = false;
            if (data.status == 1) {
                $scope.userExist = true;
            }
            if (data.status == 0 ) {
                $scope.manualGet();
            }
        },function(){});
        $timeout(function(){
            $scope.fetching = false;
        },30000);
    }
    $scope.setPassword = function () {
        if ( !$scope.signProfile.vertifyCode || ($scope.signProfile.vertifyCode != $scope.remoteCode ) ) {
            _Nofication.alert("请确保输入正确的手机号验证码","错误提示","确定",function(){});
            return;
        }
        $rootScope.loading = "loading in";
$rootScope.loaded = false;
        $scope.pageName = "设置密码";
        $scope.step = 3;
    }
    // 手动获取验证码
    $scope.manualGet = function() {
        $scope.fetching = true;
        _PPWModel.getValidateCode({"telephone":$scope.signProfile.telephone}).then(function(data){
            $scope.fetching = false;
            $scope.pageName = "获取验证码";
            $scope.step = 2;
            $scope.remoteCode = data.data.code;
        },function(){});
    }
    $scope.signUp = function () {
        if ( !$scope.signProfile.passwordInit || !$scope.signProfile.passwordAgain) {
            _Nofication.alert("密码不能为空","错误提示","确定",function(){});
            return;
        }
        if ( $scope.signProfile.passwordInit != $scope.signProfile.passwordAgain) {
            _Nofication.alert("两次输入的密码不相同","错误提示","确定",function(){});
            return;
        }
        $scope.signing = true;
        _PPWModel.updatePassword({"telephone":$scope.signProfile.telephone,"new_password":$scope.signProfile.passwordInit}).then(function(data){
            $scope.signing = false;
            _User.set("user",data.user);
            $location.path("/user").replace();
        },function(){});
    }
    var checkTelephone = function (telephone) {
        return /^1[3|4|5|8][0-9]\d{8}$/.test(telephone);
    }
}