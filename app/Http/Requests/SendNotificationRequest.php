<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'type' => ['required', 'in:rappel,info,alerte,message'],
            'titre' => ['required', 'string', 'max:150', 'regex:/^[\pL\pN\s\'.!?()-]+$/u'],
            'message' => ['required', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'Veuillez choisir un patient.',
            'patient_id.exists' => 'Le patient selectionne est invalide.',
            'type.required' => 'Le type est obligatoire.',
            'type.in' => 'Le type selectionne est invalide.',
            'titre.required' => 'Le titre est obligatoire.',
            'titre.regex' => 'Le titre contient des caracteres non autorises.',
            'message.required' => 'Le message est obligatoire.',
            'message.max' => 'Le message ne doit pas depasser 500 caracteres.',
        ];
    }
}
