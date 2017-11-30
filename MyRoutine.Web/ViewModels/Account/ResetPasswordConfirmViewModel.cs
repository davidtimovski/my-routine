using System;
using FluentValidation;
using FluentValidation.Attributes;
using FluentValidation.Results;

namespace MyRoutine.Web.ViewModels.Account
{
    [Validator(typeof(ResetPasswordConfirmValidator))]
    public class ResetPasswordConfirmViewModel
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordConfirmValidator : AbstractValidator<ResetPasswordConfirmViewModel>
    {
        public ResetPasswordConfirmValidator()
        {
            RuleFor(vm => vm.NewPassword).NotNull().WithMessage("The Password field is required.");
            RuleFor(vm => vm.NewPassword).Length(6, 100).WithMessage("The Password must be at least 6 characters long.");
            RuleFor(vm => vm.ConfirmPassword).NotNull().WithMessage("The Confirm password field is required.");

            // Compare passwords
            Custom(vm =>
            {
                if (!vm.NewPassword.Equals(vm.ConfirmPassword, StringComparison.OrdinalIgnoreCase))
                    return new ValidationFailure("ConfirmPassword", "Passwords don't match.");

                return null;
            });
        }
    }
}