<?php

namespace App\Http\Requests;

use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
{
    use ApiResponse;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    public function failedValidation(Validator $validator)
    {
        if ($this->is('api/*')) {
            $response = $this->JsonResponse(422, 'Validation Errors', $validator->errors());
            throw new ValidationException($validator, $response);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|unique:users,phone',
            'password' => ['required', 'min:8'],
            'address' => 'required'
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Name field is required',
            'email.required' => 'Email field is required',
            'email.email' => 'Email must be type of email',
            'email.unique' => 'The email address is already registered. Please use a different email.',
            'phone.required' => 'Phone filed is required',
            'phone.unique' => 'The phone is already used. Please use a different phone.',
            'password.required' => 'Password filed is required',
            'password.min' => 'Password must be at least 8 characters',
            'address.required' => 'Address is required'
        ];
    }
}
