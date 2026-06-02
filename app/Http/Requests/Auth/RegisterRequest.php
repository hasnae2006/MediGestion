<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
            'telephone' => ['required', 'string', 'regex:/^(\+212|0)[5-7][0-9]{8}$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'in:patient,responsable'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'date_naissance' => ['required_if:role,patient', 'nullable', 'date', 'before:today'],
            'lien' => ['required_if:role,patient', 'nullable', 'in:fils,fille,epoux,epouse,pere,mere,frere,soeur,infirmier,autre'],
            'adresse' => ['required_if:role,patient', 'nullable', 'string', 'max:255'],
            'responsable_id' => [
                'required_if:role,patient',
                'nullable',
                Rule::exists('users', 'id')->where('role', 'responsable'),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est obligatoire.',
            'nom.regex' => 'Le nom doit contenir seulement des lettres, espaces, tirets ou apostrophes.',
            'prenom.required' => 'Le prenom est obligatoire.',
            'prenom.regex' => 'Le prenom doit contenir seulement des lettres, espaces, tirets ou apostrophes.',
            'telephone.required' => 'Le telephone est obligatoire.',
            'telephone.regex' => 'Le telephone doit etre marocain: 06/07/05... ou +212...',
            'email.required' => 'L email est obligatoire.',
            'email.email' => 'Veuillez saisir un email valide.',
            'email.unique' => 'Cet email est deja utilise.',
            'role.required' => 'Choisissez le type de compte.',
            'role.in' => 'Le type de compte est invalide.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'date_naissance.required_if' => 'La date de naissance est obligatoire pour un patient.',
            'date_naissance.before' => 'La date de naissance doit etre dans le passe.',
            'lien.required_if' => 'Le lien est obligatoire pour un patient.',
            'lien.in' => 'Le lien selectionne est invalide.',
            'adresse.required_if' => 'L adresse est obligatoire pour un patient.',
            'adresse.max' => 'L adresse ne doit pas depasser 255 caracteres.',
            'responsable_id.required_if' => 'Choisissez un responsable pour ce patient.',
            'responsable_id.exists' => 'Le responsable selectionne est invalide.',
        ];
    }
}
