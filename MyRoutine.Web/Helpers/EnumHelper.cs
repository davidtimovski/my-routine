using System;
using System.Collections.Generic;

namespace MyRoutine.Web.Helpers
{
    public static class EnumHelper
    {
        public static IEnumerable<SelectOption> EnumToSelectOptions<T>(T enumType) where T : Type
        {
            foreach (var value in Enum.GetValues(enumType))
            {
                var name = value.ToString();
                yield return new SelectOption { Text = name, Value = (int)Enum.Parse(enumType, name) };
            }
        }
    }

    public class SelectOption
    {
        public string Text { get; set; }
        public int Value { get; set; }
    }
}