using Autofac;
using MyRoutine.Data;

namespace MyRoutine.Service.Modules
{
    public class EFModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType(typeof(MyRoutineContext)).As(typeof(IContext)).InstancePerLifetimeScope();
        }
    }
}