using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.SpaServices.Prerendering;

namespace AspNetCoreModuleDemo
{
	public class Startup
	{
		private INodeServices _nodeService;
		private string _applicationBasePath;

		public Startup(IHostingEnvironment env)
		{
			_applicationBasePath = env.ContentRootPath;

			Configuration = new ConfigurationBuilder()
					.SetBasePath(env.ContentRootPath)
					.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
					.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
					.AddEnvironmentVariables()
					.Build();
		}

		public IConfigurationRoot Configuration { get; private set; }

		public void ConfigureServices(IServiceCollection services)
		{
			// Enable Node Services
			services.AddNodeServices( options => {
			});

			var serviceProvider = services.BuildServiceProvider();
			_nodeService = serviceProvider.GetRequiredService<INodeServices>();
		}

		public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
		{
			loggerFactory.AddConsole(Configuration.GetSection("Logging"));

			var serverAddressesFeature = app.ServerFeatures.Get<IServerAddressesFeature>();

			//app.UseDefaultFiles();
			app.UseStaticFiles();

			app.Run(async (context) =>
			{
				context.Response.ContentType = "text/html";

				var requestFeature = context.Features.Get<IHttpRequestFeature>();
				var unencodedPathAndQuery = requestFeature.RawTarget;

				var request = context.Request;
				var unencodedAbsoluteUrl = $"{request.Scheme}://{request.Host}{unencodedPathAndQuery}";

				// Params: applicationBasePath, bootModule, absoluteRequestUrl, requestPathAndQuery, customDataParameter, overrideTimeoutMilliseconds, requestPathBase
				var result = await _nodeService.InvokeExportAsync<RenderToStringResult>(
                "./server/server.bundle.js",
								"default",
                _applicationBasePath,
								new JavaScriptModuleExport("server.bundle"),
                unencodedAbsoluteUrl,
                unencodedPathAndQuery,
                null,
                10000,
                request.PathBase.ToString());

				if (!string.IsNullOrEmpty(result.RedirectUrl)) {
					// It's a redirection
					context.Response.Redirect(result.RedirectUrl);
					return;
				}

        // It's some HTML to inject
				await context.Response.WriteAsync(result.Html);
			});
		}
	}
}