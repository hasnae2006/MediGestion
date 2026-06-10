<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $patient = $this->route('patient');

        return [
            'nom' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'prenom' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($patient?->user_id)],
            'telephone' => ['required', 'string', 'min:6', 'max:20', 'regex:/^[0-9+\s().-]+$/'],
            'lien' => ['required', 'in:fils,fille,epoux,epouse,pere,mere,frere,soeur,infirmier,autre'],
            'etat' => ['required', 'in:actif,inactif,gueri'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'date_naissance' => ['nullable', 'date', 'before:today'],
            'medecin_id' => ['nullable', 'exists:medecins,id'],
        ];
    }

    public function messages(): array
    {
        return (new StorePatientRequest())->messages() + [
            'etat.required' => 'L etat est obligatoire.',
            'etat.in' => 'L etat selectionne est invalide.',
        ];
    }
}
