using FluentValidation;
using FluentValidation.Attributes;

namespace MyRoutine.Web.ViewModels.Account
{
    [Validator(typeof(VerifyCurrentAccountViewModelValidator))]
    public class VerifyCurrentAccountViewModel
    {
        public string DeleteConfirmPassword { get; set; }
    }

    public class VerifyCurrentAccountViewModelValidator : AbstractValidator<VerifyCurrentAccountViewModel>
    {
        public VerifyCurrentAccountViewModelValidator()
        {
            RuleFor(vm => vm.DeleteConfirmPassword).NotNull().WithMessage("The Password field is required.");
        }
    }
}