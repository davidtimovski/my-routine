using MyRoutine.Service.Interfaces;
using System.Configuration;
using System.Net.Mail;
using System.Text;
using System.Web.Security;

namespace MyRoutine.Service.Implementations
{
    public class EmailService : IEmailService
    {
        readonly IUserService _userService;
        private readonly SmtpClient _smtpClient = new SmtpClient();

        public EmailService(IUserService userService)
        {
            _userService = userService;
        }

        

        public void SendRegisterConfirmEmail(string toName, string toEmail, string token)
        {
            string emailHtmlLayout = Resources.Email.HtmlLayout;

            const string subject = "Confirm your registration on My Routine";
            const string bodyText = "Hello, #NAME#\n\nConfirm your registration by following this link: http://myroutine.davidtimovski.com/Account/RegisterConfirmation?token=#TOKEN#";
            const string bodyHtml = "<p>Hello, #NAME#</p><p>Confirm your registration by following <a href=\"http://myroutine.davidtimovski.com/Account/RegisterConfirmation?token=#TOKEN#\">this link</a>.</p>";

            var email = new MailMessage();
            email.To.Add(new MailAddress(toEmail));

            email.Subject = subject;
            email.Body = bodyText.Replace("#NAME#", toName).Replace("#TOKEN#", token);

            string htmlEmail = emailHtmlLayout.Replace("#SUBJECT#", subject).Replace("#BODY#", bodyHtml.Replace("#NAME#", toName).Replace("#TOKEN#", token));
            var alternateView = AlternateView.CreateAlternateViewFromString(htmlEmail);
            alternateView.ContentType = new System.Net.Mime.ContentType("text/html");
            email.AlternateViews.Add(alternateView);

            email.From = new MailAddress(ConfigurationManager.AppSettings["SystemEmail"], "My Routine");
            email.SubjectEncoding = Encoding.UTF8;
            email.BodyEncoding = Encoding.UTF8;

            _smtpClient.Send(email);
        }

        public void SendPasswordResetEmail(string toName, string toEmail, string token)
        {
            var emailHtmlLayout = Resources.Email.HtmlLayout;

            const string subject = "Reset your password on My Routine";
            const string bodyText = "Hello, #NAME#\n\nReset your password by following this link: http://myroutine.davidtimovski.com/Account/ResetPasswordConfirm?token=#TOKEN#";
            const string bodyHtml = "<p>Hello, #NAME#</p><p>Reset your password by following <a href=\"http://myroutine.davidtimovski.com/Account/ResetPasswordConfirm?token=#TOKEN#\">this link</a>.</p>";

            var email = new MailMessage();
            email.To.Add(new MailAddress(toEmail));

            email.Subject = subject;
            email.Body = bodyText.Replace("#NAME#", toName).Replace("#TOKEN#", token);

            string htmlEmail = emailHtmlLayout.Replace("#SUBJECT#", subject).Replace("#BODY#", bodyHtml.Replace("#NAME#", toName).Replace("#TOKEN#", token));
            var alternateView = AlternateView.CreateAlternateViewFromString(htmlEmail);
            alternateView.ContentType = new System.Net.Mime.ContentType("text/html");
            email.AlternateViews.Add(alternateView);

            email.From = new MailAddress(ConfigurationManager.AppSettings["SystemEmail"], "My Routine");
            email.SubjectEncoding = Encoding.UTF8;
            email.BodyEncoding = Encoding.UTF8;

            _smtpClient.Send(email);
        }

        public void SendAccountDeletionReasonsEmail(string reason, string elaboration, string suggestions)
        {
            string emailHtmlLayout = Resources.Email.HtmlLayout;
            const string subject = "Someone has shared their reasons for deleting their account on My Routine";

            var adminEmails = Roles.GetUsersInRole("Admin");
            var admins = _userService.GetAll(adminEmails);

            foreach (var admin in admins)
            {
                var bodyText = "Hello, #NAME#\n\nThis is what they shared:- Reason\n" + reason + "\n\n- Elaboration\n" + elaboration + "\n\n- Suggestions\n" + suggestions;
                var bodyHtml = "<p>Hello, #NAME#</p><p>This is what they shared:</p><p>- Reason<br />" + reason + "</p><p>- Elaboration<br />" + elaboration + "</p><p>- Suggestions<br />" + suggestions + "</p>";

                var email = new MailMessage();
                email.To.Add(new MailAddress(admin.Email));

                email.Subject = subject;
                email.Body = bodyText.Replace("#NAME#", admin.Name);

                string htmlEmail = emailHtmlLayout.Replace("#SUBJECT#", subject).Replace("#BODY#", bodyHtml.Replace("#NAME#", admin.Name));
                var alternateView = AlternateView.CreateAlternateViewFromString(htmlEmail);
                alternateView.ContentType = new System.Net.Mime.ContentType("text/html");
                email.AlternateViews.Add(alternateView);

                email.From = new MailAddress(ConfigurationManager.AppSettings["SystemEmail"], "My Routine");
                email.SubjectEncoding = Encoding.UTF8;
                email.BodyEncoding = Encoding.UTF8;

                _smtpClient.Send(email);
            }
        }
    }
}