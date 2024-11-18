<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SignedIn
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(\Slides\Saml2\Events\SignedIn $event): void
    {
        $messageId = $event->getAuth()->getLastMessageId();

        // your own code preventing reuse of a $messageId to stop replay attacks

        $samlUser = $event->getSaml2User();

        $userData = [
            'saml_user_id' => $samlUser->getUserId(),
            'name' => $samlUser->getAttribute('Subject.FormattedName')[0],
            'email' => $samlUser->getAttribute('Subject.Email')[0],
            'saml_attributes' => $samlUser->getAttributes(),
            'password' => Hash::make(\Illuminate\Support\Str::random(24)), // random passwd
        ];

        $user = User::query()->updateOrCreate([
            'saml_user_id' => $samlUser->getUserId()
        ], $userData);

        if(!$user->email_verified_at) {
            $user->email_verified_at = now();
            $user->save();
        }

        // Login a user.
        Auth::login($user);
    }
}
