<?php

use App\Http\Controllers\Admin\AccessController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactUsController;
use App\Http\Controllers\Admin\OfferController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\user\AuthController;
use App\Http\Controllers\User\OfferController as UserOfferController;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\User\PaymobController;
use App\Http\Controllers\User\UserController as UserUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/
########################/*Admin Module*/##########################
Route::post('admin/login', [AccessController::class, 'login']);
Route::prefix('admin')->group(function () {
    Route::controller(ContactUsController::class)->group(function () {
        Route::get('all_messages', 'allMessages');
        Route::get('reply_message/{id}', 'replyMessage');
    });
    ##########/*Category Module*/##########
    ROute::controller(CategoryController::class)->group(function () {
        Route::post('add_category', 'addCategory');
        Route::get('all_categories', 'allCategories');
        Route::post('update_category/{id}', 'updateStatus');
    });
    ##########/*Product Module*/##########
    Route::controller(ProductController::class)->group(function () {
        Route::post('add_product', 'store');
        Route::get('all_products', 'getCategoriesWithProducts');
        Route::get('show_product/{id}', 'showProductWithCategory');
        Route::post('update_product', 'updateProduct');
        Route::get('delete_product/{id}', 'deleteProduct');
    });
    #########/*Offers Module*/#########
    Route::controller(OfferController::class)->group(function () {
        Route::post('add_offer', 'addOffer');
        Route::post('update_offer', 'updateOffer');
        Route::get('all_offers', 'allOffers');
        Route::get('delete_offer/{id}', 'deleteOffer');
        Route::get('show_offer/{id}', 'showOffer');
    });
    Route::get('all_users', [UserController::class, 'allUsers']);
    #########/*Orders Module*/#########
    Route::controller(AdminOrderController::class)->group(function () {
        Route::get('undelivered_orders', 'undeliveredOrders');
        Route::get('deliver_order/{id}', 'deliverOrder');
        Route::get('delivered_orders', 'deliveredOrders');
    });
});

########################/*User Module*/##########################
Route::prefix('user')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::post('register', 'register');
        Route::post('login', 'login');
    });
    Route::post('state', [PaymobController::class, 'state']);
    Route::middleware(['auth:sanctum'])->group(function () {
        ###############User Controller#################
        Route::controller(UserUserController::class)->group(function () {
            Route::get('home', 'index');
            Route::get('products', 'allProducts')->withoutMiddleware(['auth:sanctum']);
            Route::post('update', 'updateData');
            Route::post('Contact_Us', 'contactUs')->withoutMiddleware(['auth:sanctum']);
            Route::get('show_product/{id}', 'showProduct')->withoutMiddleware(['auth:sanctum']);
            Route::get('all_categories', 'allCategories')->withoutMiddleware(['auth:sanctum']);
        });
        ###############Order Controller################
        Route::controller(OrderController::class)->group(function () {
            Route::get('all_orders', 'allOrders');
            Route::post('make_order', 'makeOrder');
        });
        ##############Offer Controller#################
        Route::controller(UserOfferController::class)->group(function () {
            Route::get('all_offers', 'allOffers')->withoutMiddleware(['auth:sanctum']);
        });
    });
});
