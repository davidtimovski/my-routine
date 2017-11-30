using FluentValidation;
using FluentValidation.Attributes;

namespace MyRoutine.Web.ViewModels.Account
{
    [Validator(typeof(ResetPasswordValidator))]
    public class ResetPasswordViewModel
    {
        public string Email { get; set; }
    }

    public class ResetPasswordValidator : AbstractValidator<ResetPasswordViewModel>
    {
        public ResetPasswordValidator()
        {
            RuleFor(x => x.Email).NotNull().WithMessage("The Email field is required.");
        }
    }
}