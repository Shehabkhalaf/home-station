<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Notifications\Messages\MailMessage;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        VerifyEmail::toMailUsing(function ($notifible, $url) {
            $spaUrl = 'http://127.0.0.1:8000/email_verify?email_verify_url=' . $url;
            return (new MailMessage)->subject('Verify Email Address')->line('Click the button to verify your email address.')->action('Verify Email Address', $spaUrl);
        });
    }
}
