<?php

namespace App\Http\Requests;

use App\Traits\ApiResponse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class SendMessageRequest extends FormRequest
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
            'email' => 'required|email',
            'name' => 'required',
            'message' => 'required'
        ];
    }
    public function messages(): array
    {
        return [
            'email.required' => 'Email Field is required',
            'email.email' => 'Email must have @',
            'name.required' => 'name field is required',
            'message.required' => 'Message field is required'
        ];
    }
}