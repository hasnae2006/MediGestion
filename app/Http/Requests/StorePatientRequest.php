<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'prenom' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'telephone' => ['required', 'string', 'regex:/^(\+212|0)[5-7][0-9]{8}$/'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'lien' => ['required', 'in:fils,fille,epoux,epouse,pere,mere,frere,soeur,infirmier,autre'],
            'date_naissance' => ['nullable', 'date', 'before:today'],
            'medecin_id' => ['nullable', 'exists:medecins,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est obligatoire.',
            'nom.regex' => 'Le nom doit contenir seulement des lettres.',
            'prenom.required' => 'Le prenom est obligatoire.',
            'prenom.regex' => 'Le prenom doit contenir seulement des lettres.',
            'email.required' => 'L email est obligatoire.',
            'email.email' => 'Veuillez saisir un email valide.',
            'email.unique' => 'Cet email est deja utilise.',
            'telephone.required' => 'Le telephone est obligatoire.',
            'telephone.regex' => 'Le telephone doit etre marocain: 06/07/05... ou +212...',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'lien.required' => 'Le lien est obligatoire.',
            'lien.in' => 'Le lien selectionne est invalide.',
            'date_naissance.before' => 'La date de naissance doit etre dans le passe.',
            'medecin_id.exists' => 'Le medecin selectionne est invalide.',
        ];
    }
}
