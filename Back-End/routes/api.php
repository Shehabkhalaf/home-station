<?php

use App\Http\Controllers\Admin\AccessController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactUsController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\user\AuthController;
use App\Http\Controllers\User\OrderController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
########################/*Admin Module*/##########################
Route::get('admin/dachboard', [AccessController::class, 'permitted'])->middleware('admin.access');
Route::prefix('admin')->controller(ContactUsController::class)->group(function () {
    Route::get('all_messages', 'allMessages');
    Route::get('reply_message/{id}', 'replyMessage');
    Route::get('all_users', [UserController::class, 'allUsers']);
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
    });
});

########################/*User Module*/##########################
Route::prefix('user')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::post('register', 'register');
        Route::post('login', 'login');
        Route::post('/email/verification-notification', 'sendVerification')->middleware('auth:sanctum');
        Route::get('/email/verify/{id}/{hash}', 'verify')->middleware('auth:sanctum')->name('verification.verify');
        /*Route::middleware('auth:sanctum', 'verified')->controller(UserUserController::class)->group(function () {
            Route::get('home', 'index');
            Route::get('products', 'allProducts');
            Route::post('update', 'updateData');
            Route::post('Contact Us', 'contactUs')->withoutMiddleware(['auth:sanctum', 'verified']);
        });
        Route::middleware('auth:sanctum')->controller(OrderController::class)->group(function () {
            Route::get('all_orders', 'allOrders');
        });*/
    });
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::controller(UserUserController::class)->group(function () {
            Route::get('home', 'index');
            Route::get('products', 'allProducts');
            Route::post('update', 'updateData');
            Route::post('Contact Us', 'contactUs')->withoutMiddleware(['auth:sanctum', 'verified']);
        });
        Route::controller(OrderController::class)->group(function () {
            Route::get('all_orders', 'allOrders');
        });
    });
});