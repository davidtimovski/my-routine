using FluentValidation;
using FluentValidation.Attributes;

namespace MyRoutine.Web.Areas.Admin.ViewModels.Users
{
    [Validator(typeof(BanUserViewModelValidator))]
    public class BanUserViewModel
    {
        public int Id { get; set; }
        public string BanReason { get; set; }
    }

    public class BanUserViewModelValidator : AbstractValidator<BanUserViewModel>
    {
        public BanUserViewModelValidator()
        {
            RuleFor(vm => vm.BanReason).NotNull().WithMessage("The Ban Reason field is required.");
            RuleFor(vm => vm.BanReason).Length(1, 255).WithMessage("The Ban Reason cannot exceed 255 characters in length.");
        }
    }
}