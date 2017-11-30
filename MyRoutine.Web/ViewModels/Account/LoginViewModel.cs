using FluentValidation;
using FluentValidation.Attributes;

namespace MyRoutine.Web.ViewModels.Account
{
    [Validator(typeof(LoginModelValidator))]
    public class LoginViewModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }

    public class LoginModelValidator : AbstractValidator<LoginViewModel>
    {
        public LoginModelValidator()
        {
            RuleFor(vm => vm.Email).NotNull().WithMessage("The Email field is required.");
            RuleFor(vm => vm.Password).NotNull().WithMessage("The Password field is required.");
        }
    }
}