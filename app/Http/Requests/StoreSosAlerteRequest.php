<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSosAlerteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'message.required' => 'Le message SOS est obligatoire.',
            'message.min' => 'Le message doit contenir au moins 5 caracteres.',
            'message.max' => 'Le message ne doit pas depasser 1000 caracteres.',
        ];
    }
}
