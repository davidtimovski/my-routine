using System;
using FluentValidation;
using FluentValidation.Attributes;
using FluentValidation.Results;

namespace MyRoutine.Web.ViewModels.Profile
{
    [Validator(typeof(ChangePasswordViewModelValidator))]
    public class ChangePasswordViewModel
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class ChangePasswordViewModelValidator : AbstractValidator<ChangePasswordViewModel>
    {
        public ChangePasswordViewModelValidator()
        {
            RuleFor(vm => vm.OldPassword).NotNull().WithMessage("The Old password field is required.");
            RuleFor(vm => vm.NewPassword).NotNull().WithMessage("The New password field is required.");
            RuleFor(vm => vm.NewPassword).Length(6, 100).WithMessage("The New password must be at least 6 characters long.");
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