<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admin_orders', function (Blueprint $table) {
            $table->id();
            $table->text('user_data');
            $table->text('order_details');
            $table->string('total_price');
            $table->string('status')->default('no');
            $table->enum('paid', ['cash', 'paid'])->default('cash');
            $table->text('payment_details')->nullable();
            $table->string('promocode')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_orders');
    }
};
