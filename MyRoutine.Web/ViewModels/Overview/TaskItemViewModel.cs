using FluentValidation;
using FluentValidation.Attributes;
using System;

namespace MyRoutine.Web.ViewModels.Overview
{
    [Validator(typeof(TaskItemViewModelValidator))]
    public class TaskItemViewModel
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public DateTime Date { get; set; }
        public short? DurationMinutes { get; set; }
        public short? Repetitions { get; set; }
    }

    public class TaskItemViewModelValidator : AbstractValidator<TaskItemViewModel>
    {
        public TaskItemViewModelValidator()
        {
            RuleFor(vm => vm.Id).NotNull().WithMessage("An error occured while saving the schedule.");
            RuleFor(vm => vm.Id).InclusiveBetween(0, int.MaxValue).WithMessage("An error occured while saving the schedule.");
            RuleFor(vm => vm.Date).NotNull().WithMessage("The Date field of task items is required.");
        }
    }
}