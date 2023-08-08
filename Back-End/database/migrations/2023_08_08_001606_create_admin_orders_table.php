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
            $table->bigInteger('id')->primary();
            $table->string('user_data');
            $table->string('order_details');
            $table->enum('status', ['shipped', 'delivered', 'in consider'])->default('in consider');
            $table->enum('paid', ['cash', 'paid'])->default('cash');
            $table->text('payment_details')->nullable();
            $table->timestamp('ordered_date');
            $table->timestamp('shipped_date')->nullable();
            $table->timestamp('delivered_date')->nullable();
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
