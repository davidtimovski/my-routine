using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace MyRoutine.Web.Helpers
{
    public static class ExceptionLogging
    {
        private static string _errorLineNumber;
        private static string _errorMessage;
        private static string _exceptionType;
        private static string _exceptionUrl;

        public static void SendErrorToText(ExceptionContext exceptionContext)
        {
            _errorLineNumber = (new StackTrace(exceptionContext.Exception, true)).GetFrame(0).GetFileLineNumber().ToString(CultureInfo.InvariantCulture);
            _exceptionType = exceptionContext.Exception.GetType().ToString();
            _exceptionUrl = HttpContext.Current.Request.Url.ToString();
            _errorMessage = exceptionContext.Exception.Message;

            string filePath = exceptionContext.HttpContext.Server.MapPath("~/App_Data/ErrorLogs/");
            filePath = filePath + DateTime.Today.ToString("dd-MMM-yyyy") + ".txt";
            if (!File.Exists(filePath))
            {
                File.Create(filePath).Dispose();
            }

            using (StreamWriter sw = File.AppendText(filePath))
            {
                const string separator = "-------------------------------------------------------------------";
                sw.WriteLine(separator);
                sw.WriteLine("---------------- Exception occurred at " + DateTime.Now.ToString("hh:mm:ss tt") + " ----------------");
                sw.WriteLine(separator + Environment.NewLine);
                sw.WriteLine("Error Line Number:" + " " + _errorLineNumber + Environment.NewLine);
                sw.WriteLine("Exception Type:" + " " + _exceptionType + Environment.NewLine);
                sw.WriteLine("Error Message:" + " " + _errorMessage + Environment.NewLine);
                sw.WriteLine("Error Page Url:" + " " + _exceptionUrl + Environment.NewLine);
                sw.WriteLine("------------------------------- End -------------------------------");
                sw.WriteLine(Environment.NewLine + Environment.NewLine);
                sw.Flush();
                sw.Close();
            }
        }
    }
}