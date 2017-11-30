using FluentValidation;
using FluentValidation.Attributes;
using FluentValidation.Results;
using System;
using System.Text.RegularExpressions;

namespace MyRoutine.Web.ViewModels.Account
{
    [Validator(typeof(RegisterViewModelValidator))]
    public class RegisterViewModel
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class RegisterViewModelValidator : AbstractValidator<RegisterViewModel>
    {
        public RegisterViewModelValidator()
        {
            RuleFor(vm => vm.Email).NotNull().WithMessage("The Email field is required.");
            RuleFor(vm => vm.Email).EmailAddress().WithMessage("The Email address you provided is invalid.");
            RuleFor(vm => vm.Name).NotNull().WithMessage("The Name field is required.");
            RuleFor(vm => vm.Name).Length(2, 30).WithMessage("The Name must be at least 2 characters long.");
            RuleFor(vm => vm.Name).Matches("^[a-z ,.'-]+$", RegexOptions.IgnoreCase).WithMessage("The Name can be made up of only letters and hyphens.");
            RuleFor(vm => vm.Password).NotNull().WithMessage("The Password field is required.");
            RuleFor(vm => vm.Password).Length(6, 100).WithMessage("The Password must be at least 6 characters long.");
            RuleFor(vm => vm.ConfirmPassword).NotNull().WithMessage("The Confirm password field is required.");

            // Compare passwords
            Custom(vm =>
            {
                if (!vm.Password.Equals(vm.ConfirmPassword, StringComparison.OrdinalIgnoreCase))
                    return new ValidationFailure("ConfirmPassword", "Passwords don't match.");

                return null;
            });
        }
    }
}