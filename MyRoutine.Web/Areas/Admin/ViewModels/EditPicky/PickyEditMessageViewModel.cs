using FluentValidation;
using FluentValidation.Attributes;
using MyRoutine.Service;

namespace MyRoutine.Web.Areas.Admin.ViewModels.EditPicky
{
    [Validator(typeof(PickyEditMessageViewModelValidator))]
    public class PickyEditMessageViewModel
    {
        public int Id { get; set; }
        public PickyMessageType Type { get; set; }
        public string Message { get; set; }
    }

    public class PickyEditMessageViewModelValidator : AbstractValidator<PickyEditMessageViewModel>
    {
        public PickyEditMessageViewModelValidator()
        {
            RuleFor(vm => vm.Type).NotNull().WithMessage("The Type field is required.");
            RuleFor(vm => vm.Message).NotNull().WithMessage("The Message field is required.");
            RuleFor(vm => vm.Message).Length(1, 255).WithMessage("The Message cannot exceed 255 characters in length.");
        }
    }
}