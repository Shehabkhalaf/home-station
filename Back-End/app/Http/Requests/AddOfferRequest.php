<?php

namespace App\Http\Requests;

use App\Traits\ApiResponse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class AddOfferRequest extends FormRequest
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
            'promocode' => 'required|unique:offers,promocode',
            'discount' => 'required',
            'started_at' => 'required',
            'expired_at' => 'required'
        ];
    }
    public function messages(): array
    {
        return [
            'promocode.required' => 'Promocode field is required',
            'promocode.unique' => 'Promocode already exists',
            'started_at.required' => 'Started_at date is required',
            'expried_at.required' => 'Expired_at date is required'
        ];
    }
}
