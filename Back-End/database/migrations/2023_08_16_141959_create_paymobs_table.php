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
        Schema::create('paymobs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('order_id')->unique();
            $table->bigInteger('transction_id')->unique();
            $table->string('success');
            $table->string('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paymobs');
    }
};
