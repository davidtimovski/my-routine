using System;
using System.Web;

namespace MyRoutine.Service
{
    public class UserSessionData
    {
        const string IdKey = "Id";
        const string EmailKey = "Email";
        const string NameKey = "Name";
        const string DateRegisteredKey = "DateRegistered";
        const string LastLoginAtKey = "LastLoginAt";
        const string ScheduleIsCompactKey = "ScheduleIsCompact";
        const string HasBeenIntroducedToPickyKey = "HasBeenIntroducedToPicky";
        const string HasBeenGreetedByPickyKey = "HasBeenGreetedByPicky";
        const string NoLoginInAWhileKey = "NoLoginInAWhile";

        public static int Id
        {
            get { return HttpContext.Current.Session[IdKey] != null ? (int)HttpContext.Current.Session[IdKey] : 0; }
            set { HttpContext.Current.Session[IdKey] = value; }
        }

        public static string Email
        {
            get { return HttpContext.Current.Session[EmailKey] != null ? (string)HttpContext.Current.Session[EmailKey] : ""; }
            set { HttpContext.Current.Session[EmailKey] = value; }
        }

        public static string Name
        {
            get { return HttpContext.Current.Session[NameKey] != null ? (string)HttpContext.Current.Session[NameKey] : "User"; }
            set { HttpContext.Current.Session[NameKey] = value; }
        }

        public static DateTime DateRegistered
        {
            get { return HttpContext.Current.Session[DateRegisteredKey] != null ? (DateTime)HttpContext.Current.Session[DateRegisteredKey] : new DateTime(); }
            set { HttpContext.Current.Session[DateRegisteredKey] = value; }
        }

        public static DateTime? LastLoginAt
        {
            get { return HttpContext.Current.Session[LastLoginAtKey] != null ? (DateTime?)HttpContext.Current.Session[LastLoginAtKey] : null; }
            set { HttpContext.Current.Session[LastLoginAtKey] = value; }
        }

        public static bool ScheduleIsCompact
        {
            get { return HttpContext.Current.Session[ScheduleIsCompactKey] != null && (bool)HttpContext.Current.Session[ScheduleIsCompactKey]; }
            set { HttpContext.Current.Session[ScheduleIsCompactKey] = value; }
        }

        public static bool HasBeenIntroducedToPicky
        {
            get { return HttpContext.Current.Session[HasBeenIntroducedToPickyKey] != null && (bool)HttpContext.Current.Session[HasBeenIntroducedToPickyKey]; }
            set { HttpContext.Current.Session[HasBeenIntroducedToPickyKey] = value; }
        }

        public static bool HasBeenGreetedByPicky
        {
            get { return HttpContext.Current.Session[HasBeenGreetedByPickyKey] != null && (bool)HttpContext.Current.Session[HasBeenGreetedByPickyKey]; }
            set { HttpContext.Current.Session[HasBeenGreetedByPickyKey] = value; }
        }

        public static bool NoLoginInAWhile
        {
            get { return HttpContext.Current.Session[NoLoginInAWhileKey] != null && (bool)HttpContext.Current.Session[NoLoginInAWhileKey]; }
            set { HttpContext.Current.Session[NoLoginInAWhileKey] = value; }
        }



        public static void Empty()
        {
            HttpContext.Current.Session[IdKey] = "";
            HttpContext.Current.Session[EmailKey] = "";
            HttpContext.Current.Session[NameKey] = "";
            HttpContext.Current.Session[DateRegisteredKey] = "";
            HttpContext.Current.Session[LastLoginAtKey] = "";
            HttpContext.Current.Session[ScheduleIsCompactKey] = "";
            HttpContext.Current.Session[HasBeenIntroducedToPickyKey] = "";
            HttpContext.Current.Session[HasBeenGreetedByPickyKey] = "";
            HttpContext.Current.Session[NoLoginInAWhileKey] = "";
        }
    }
}