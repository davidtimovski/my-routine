using FluentValidation;
using FluentValidation.Attributes;
using MyRoutine.Service;
using System;

namespace MyRoutine.Web.ViewModels.Tasks
{
    [Validator(typeof(TaskViewModelValidator))]
    public class TaskViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string ShortTitle { get; set; }
        public string Description { get; set; }
        public short? DurationMinutes { get; set; }
        public short? Repetitions { get; set; }
        public TaskTheme Theme { get; set; }
        public string ThemeName { get; set; }
        public short? Order { get; set; }
        public DateTime DateCreated { get; set; }
        public bool IsArchived { get; set; }
        public bool HasNoCompletedItems { get; set; }
    }

    public class TaskViewModelValidator : AbstractValidator<TaskViewModel>
    {
        public TaskViewModelValidator()
        {
            RuleFor(vm => vm.Id).NotNull().WithMessage("An error occured.");
            RuleFor(vm => vm.Id).InclusiveBetween(0, int.MaxValue).WithMessage("An error occured.");
            RuleFor(vm => vm.Title).NotNull().WithMessage("The Title field is required.");
            RuleFor(vm => vm.Title).Length(3, 50).WithMessage("The Title must be between 3 and 50 characters in length.");
            RuleFor(vm => vm.ShortTitle).NotNull().WithMessage("he Short title field is required.");
            RuleFor(vm => vm.ShortTitle).Length(1, 10).WithMessage("The Short title must be between 1 and 10 characters in length.");
            RuleFor(vm => vm.Description).Length(0, 200).WithMessage("The Description cannot exceed 200 characters in length.");
            RuleFor(vm => vm.Theme).NotNull().WithMessage("The Theme field is required.");
        }
    }
}