<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    use ApiResponse;
    public function register(RegisterRequest $registerRequest)
    {
        $user = User::create($registerRequest->all());
        if ($user) {
            $data['token'] = $user->createToken('register')->plainTextToken;
            $data['name'] = $user->name;
            $data['email'] = $user->email;
            $data['phone'] = $user->phone;
            $data['location'] = $user->address;
            return $this->JsonResponse(201, 'Registration Done', $data);
        } else {
            return $this->JsonResponse(422, 'Registration Failed');
        }
    }
    public function login(LoginRequest $loginRequest)
    {
        if (Auth::attempt(['email' => $loginRequest->email, 'password' => $loginRequest->password])) {
            $user = Auth::user();
            $data['token'] = $user->createToken('login')->plainTextToken;
            $data['name'] = $user->name;
            $data['email'] = $user->email;
            $data['phone'] = $user->phone;
            $data['location'] = $user->address;
            return $this->JsonResponse(200, 'You are logged in', $data);
        } else {
            return $this->JsonResponse(401, 'Must register before logging', null);
        }
    }
    public function sendVerification(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();
        return $this->JsonResponse(200, 'Email Sent');
    }
    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();
        return $this->JsonResponse(200, 'Verified Successfully');
    }
}