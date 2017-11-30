using System.Text.RegularExpressions;
using FluentValidation;
using FluentValidation.Attributes;

namespace MyRoutine.Web.ViewModels.Profile
{
    [Validator(typeof(ChangeUserDetailsViewModelValidator))]
    public class ChangeUserDetailsViewModel
    {
        public string OriginalEmail { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
    }

    public class ChangeUserDetailsViewModelValidator : AbstractValidator<ChangeUserDetailsViewModel>
    {
        public ChangeUserDetailsViewModelValidator()
        {
            RuleFor(vm => vm.Email).NotNull().WithMessage("The Email field is required.");
            RuleFor(vm => vm.Email).EmailAddress().WithMessage("The Email address you provided is invalid.");
            RuleFor(vm => vm.Name).NotNull().WithMessage("The Name field is required.");
            RuleFor(vm => vm.Name).Length(2, 30).WithMessage("The Name must be at least 2 characters long.");
            RuleFor(vm => vm.Name).Matches("^[a-z ,.'-]+$", RegexOptions.IgnoreCase).WithMessage("The Name can be made up of only letters and hyphens.");
            RuleFor(vm => vm.Password).NotNull().WithMessage("The Password field is required.");
        }
    }
}