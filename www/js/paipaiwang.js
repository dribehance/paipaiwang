var paipaiwang = angular.module("paipaiwang",[
		"ngRoute",
		"ngAnimate",
		"ngTouch",
		"ngSanitize",
		"ngCookies",
		"timer",
		"wrapOwlcarousel"
	]).config([
		"$routeProvider",
		"$httpProvider",
		function($routeProvider,$httpProvider){
			$routeProvider.
			when("/index",{
				templateUrl: "view/index.html",
				controller: indexController
			}).
			when("/nearby",{
				templateUrl: "view/nearby.html",
				controller: nearbyController
			}).
			when("/shopping_cart",{
				templateUrl: "view/shopping_cart.html",
				controller: shoppingCartController,
				resolve: {
					factory: checkAuthen
				}
			}).
			when("/user",{
				templateUrl: "view/user.html",
				controller: userController,
				resolve: {
					factory: checkAuthen
				}
			}).
			when("/strategy",{
				templateUrl: "view/strategy.html",
				controller: strategyController
			}).
			when("/hot",{
				templateUrl: "view/hot.html",
				controller: hotController
			}).
			when("/auctions",{
				templateUrl: "view/auctions.html",
				controller: auctionsController
			}).
			when("/auction/:auctionID",{
				templateUrl: "view/auction.html",
				controller: auctionController,
				resolve: {
					_Auction: function(_PPWModel,$route) {
						var auctionID = $route.current.pathParams.auctionID;
						return _PPWModel.getAuction({"id":auctionID})
					}
				}
			}).
			when("/auction_orders",{
				templateUrl: "view/auction_orders.html",
				controller: auctionOrdersController,
				resolve: {
					factory: checkAuthen
				}
			}).
			when("/auction_orders/:orderID",{
				templateUrl: "view/auction_order.html",
				controller: auctionOrderController,
				resolve: {
					_AuctionOrder: function(_PPWModel,$route,_User) {
						var orderID = $route.current.pathParams.orderID;
						return _PPWModel.getAuctionOrder({"user_id":_User.get().user_id,"orderID":orderID})
					}
				}
			}).
			when("/auction_comfirm/:orderID",{
				templateUrl: "view/auction_comfirm.html",
				controller: auctionComfirmController
			}).
			when("/auction_track/:orderID",{
				templateUrl: "view/auction_track.html",
				controller: auctionTrackController
			}).
			when("/auction_place/:productID",{
				templateUrl: "view/auction_place.html",
				controller: auctionPlaceController,
				resolve: {
					_AuctionComfirmInfo: function(_PPWModel,_User) {
						var productID = $route.current.pathParams.productID;
						return _PPWModel.getAuctionComfirmInfo({"productID":productID,"user_id":_User.get().user_id});
					}
				}
			}).
			when("/lucky_auctions/:auctionID",{
				templateUrl: "view/lucky_auction.html",
				controller: luckyAuctionController,
				resolve: {
					_LuckyAuction: function(_PPWModel,$route) {
						var auctionID = $route.current.pathParams.auctionID;
						return _PPWModel.getLuckyAuction({"id":auctionID})
					}
				}
			}).
			when("/lucky_auctions",{
				templateUrl: "view/lucky_auctions.html",
				controller: luckyAuctionsController
			}).
			when("/lucky_auction_place/:productID",{
				templateUrl: "view/lucky_auction_place.html",
				controller: luckyAuctionPlaceController, 
				resolve: {
					_LuckyAuctionComfirmInfo:function(_PPWModel,$route,_User) {
						var productID = $route.current.pathParams.productID;
						return _PPWModel.getLuckyAuctionComfirmInfo({"product_id":productID,"user_id":_User.get().user_id});
					}
				}
			}).
			when("/charge",{
				templateUrl: "view/charge.html",
				controller: chargeController
			}).
			when("/charge_comfirm/:money/:telephone",{
				templateUrl: "view/charge_comfirm.html",
				controller: chargeComfirmController
			}).
			when("/charge_reach/:money/:telephone/:payment",{
				templateUrl: "view/charge_reach.html",
				controller: chargeReachController
			}).
			when("/welfare",{
				templateUrl: "view/welfare.html",
				controller: welfareController
			}).
			when("/orders",{
				templateUrl: "view/orders.html",
				controller: ordersController,
				resolve: {
					factory: checkAuthen
				}
			}).
			when("/orders/:orderID",{
				templateUrl: "view/order.html",
				controller: orderController
			}).
			when("/order_return",{
				templateUrl: "view/order_return.html",
				controller: orderReturnController
			}).
			when("/order_track/:orderID",{
				templateUrl: "view/order_track.html",
				controller: orderTrackController
			}).
			when("/order_state",{
				templateUrl: "view/order_state.html",
				controller: orderStateController
			}).
			when("/order_comfirm",{
				templateUrl: "view/order_comfirm.html",
				controller: orderComfirmController
			}).
			when("/order_exchange",{
				templateUrl: "view/order_exchange.html",
				controller: orderExchangeController
			}).
			when("/product/:productID",{
				templateUrl: "view/product.html",
				controller: productController
			}).
			when("/payment",{
				templateUrl: "view/payment.html",
				controller: paymentController
			}).
			when("/catalogs",{
				templateUrl: "view/catalogs.html",
				controller: catalogsController
			}).
			when("/catalog/:catalogID/:catalogName",{
				templateUrl: "view/catalog.html",
				controller: catalogController
			}).
			when("/provinces",{
				templateUrl: "view/provinces.html",
				controller: provincesController
			}).
			when("/cities/:province",{
				templateUrl: "view/cities.html",
				controller: citiesController
			}).
			when("/nearby_stores",{
				templateUrl: "view/nearby_stores.html",
				controller: nearbyStoresController
			}).
			when("/nearby_store/:catalogName",{
				templateUrl: "view/nearby_store.html",
				controller: nearbyStoreController
			}).
			/*when("/nearby_exchange",{
				templateUrl: "view/nearby_exchange.html",
				controller: nearbyExchangeController
			}).*/
			when("/nearby_exchanges",{
				templateUrl:"view/nearby_exchanges.html",
				controller: nearbyExchangesController
			}).
			when("/nearby_activity",{
				templateUrl: "view/nearby_activity.html",
				controller: nearbyActivityController
			}).
			when("/nearby_hot_store",{
				templateUrl: "view/nearby_hot_store.html",
				controller: nearbyHotStoreController
			}).
			when("/store/:storeID",{
				templateUrl: "view/store.html",
				controller: storeController
			}).
			when("/store_gallery/:storeID",{
				templateUrl: "view/store_gallery.html",
				controller: storeGalleryController
			}).
			when("/store_exchanges/:storeID",{
				templateUrl: "view/store_exchanges.html",
				controller: storeExchangesController
			}).
			when("/store_exchange_detail/:storeID",{
				templateUrl: "view/store_exchange_detail.html",
				controller: storeExchangeDetailController
			}).
			when("/store_exchange/:targetID/:storeID",{
				templateUrl: "view/store_exchange.html",
				controller: storeExchangeInfoController
			}).
			when("/store_comments/:storeID",{
				templateUrl: "view/store_comments.html",
				controller: storeCommentsController
			}).
			when("/comment/:targetID",{
				templateUrl: "view/comment.html",
				controller: commentController
			}).
			when("/exchange_place/:exchangeID",{
				templateUrl: "view/exchange_place.html",
				controller: exchangePlaceController
			}).
			when("/personal_info",{
				templateUrl: "view/personal_info.html",
				controller: personalInfoController
			}).
			when("/modify_password",{
				templateUrl: "view/modify_password.html",
				controller: modifyPasswordController
			}).
			when("/more",{
				templateUrl: "view/more.html",
				controller: moreController,
				resolve: {
					factory: checkAuthen
				}
			}).
			when("/favour",{
				templateUrl: "view/favour.html",
				controller: favourController
			}).
			when("/record",{
				templateUrl: "view/record.html",
				controller: recordController
			}).
			when("/message",{
				templateUrl: "view/message.html",
				controller: messageController
			}).
			when("/addresses",{
				templateUrl: "view/addresses.html",
				controller: addressesController
			}).
			when("/addresses/:addressID",{
				templateUrl: "view/address.html",
				controller: addressController
			}).
			when("/address_new",{
				templateUrl: "view/address_new.html",
				controller: addressNewController
			}).
			when("/feedback",{
				templateUrl: "view/feedback.html",
				controller: feedbackController
			}).
			when("/sign_in",{
				templateUrl:"view/sign_in.html",
				controller:signInController
			}).
			when("/sign_up",{
				templateUrl:"view/sign_up.html",
				controller:signUpController
			}).
			when("/forget",{
				templateUrl:"view/forget.html",
				controller:forgetController
			}).
			otherwise({
				redirectTo: "/index"
			});

			delete $httpProvider.defaults.headers.common['X-Requested-With'];
		}
	]).run(function($rootScope,$window,$templateCache,$sce,_Geo,_User,_CityCookie,_EventHandler){
		$rootScope.slide = 'slide-left';
		// $rootScope.host = "http://114.215.102.155:8080/";
		$rootScope.host = "http://218.85.137.242:8080/";
		$rootScope.bannerHost = "http://218.85.137.242:8080/upload/";
		$rootScope.IMG_PATH=$rootScope.host+"upload/picture/";
		$rootScope.PERSON_IMG_PATH=$rootScope.host+"upload/person/";

		$rootScope.back = function() {
			$rootScope.slide = 'slide-right';
			$window.history.back();
		}
		$rootScope.next = function () {
			if ( $rootScope.offline ) {
				return;
			}
			$rootScope.slide = 'slide-left';
		}
		$rootScope.backIndex = function () {
			if ( $rootScope.offline ) {
				return;
			}
			$rootScope.slide = 'slide-right';
		}
		$rootScope.jump = function () {
			if ( $rootScope.offline ) {
				return;
			}
			$rootScope.slide = 'jump';
		}
		$rootScope.trustAsHtml = function (safehtml) {
			return $sce.trustAsHtml(safehtml)
		}
		$rootScope.toInt = function(intstring) {
			return parseInt(intstring);
		}
		$templateCache.put("view/index.html",angular.element("#index-cache").html());
		$templateCache.put("view/nearby.html",angular.element("#nearby-cache").html());
		$templateCache.put("view/shopping_cart.html",angular.element("#shoppingcart-cache").html());
		$templateCache.put("view/user.html",angular.element("#user-cache").html());
		_Geo.getDefaultPosition();
		_EventHandler.onBackKeyDown();
		_EventHandler.onOffline();
		_EventHandler.online();
		_EventHandler.onProgress();
	});