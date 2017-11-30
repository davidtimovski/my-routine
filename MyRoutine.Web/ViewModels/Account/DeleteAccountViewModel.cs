using FluentValidation;
using FluentValidation.Attributes;

namespace MyRoutine.Web.ViewModels.Account
{
    [Validator(typeof(DeleteAccountViewModelValidator))]
    public class DeleteAccountViewModel
    {
        public string DeleteConfirmPassword { get; set; }
        public string Reason { get; set; }
        public string Elaboration { get; set; }
        public string Suggestions { get; set; }
    }

    public class DeleteAccountViewModelValidator : AbstractValidator<DeleteAccountViewModel>
    {
        public DeleteAccountViewModelValidator()
        {
            RuleFor(vm => vm.DeleteConfirmPassword).NotNull().WithMessage("The Password field is required.");
            RuleFor(vm => vm.Reason).NotNull().WithMessage("The Reason field is required.");
            RuleFor(vm => vm.Elaboration).Length(0, 1000).WithMessage("The Elaboration cannot exceed 1000 characters in length.");
            RuleFor(vm => vm.Suggestions).Length(0, 3000).WithMessage("The Suggestions cannot exceed 3000 characters in length.");
        }
    }
}