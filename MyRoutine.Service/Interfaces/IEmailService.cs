namespace MyRoutine.Service.Interfaces
{
    public interface IEmailService
    {
        void SendRegisterConfirmEmail(string toName, string toEmail, string token);
        void SendPasswordResetEmail(string toName, string toEmail, string token);
        void SendAccountDeletionReasonsEmail(string reason, string elaboration, string suggestions);
    }
}