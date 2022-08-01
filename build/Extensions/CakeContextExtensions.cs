using System.Linq;
using System.Reflection;

using Cake.Common;
using Cake.Common.Diagnostics;
using Cake.Common.IO;
using Cake.Common.Solution;
using Cake.Core;
using Cake.Core.IO;

namespace Build.Extensions
{
  public static class CakeContextExtensions
  {
    public static DirectoryPath GetDirectoryPath(this ICakeContext aContext, string aDirectoryPath)
    {
      return aContext.Directory(aDirectoryPath).Path;
    }

    /// <summary>
    /// Provides the full directory-path and fileinfo for the sln-file.
    /// </summary>
    /// <exception cref="CakeException">Throws if directory does not exist.</exception>
    public static (string solutionDirectoryFullPath, IFile solutionFile, SolutionParserResult solution) GetSolutionInfo(this ICakeContext aContext)
    {
      Assembly asm = Assembly.GetExecutingAssembly();
      string asmFileLocation = asm.Location;
      DirectoryPath slnDirCandidate = aContext.FileSystem.GetFile(asmFileLocation).Path.GetDirectory();
      IFile slnFile;

      do
      {
        slnDirCandidate = slnDirCandidate.Combine(new DirectoryPath("../"));

        if (!aContext.FileSystem.Exist(slnDirCandidate))
        {
          throw new CakeException($"{nameof(slnDirCandidate)} = '{slnDirCandidate}' does not exist!");
        }

        slnFile = aContext.FileSystem
          .GetDirectory(slnDirCandidate)
          .GetFiles("*.sln", SearchScope.Current)
          .FirstOrDefault();
      }
      while (slnFile == null);

      string solutionDirectoryFullPath = aContext.FileSystem.GetDirectory(System.IO.Path.GetFullPath(slnDirCandidate.FullPath)).Path
        .FullPath;
      SolutionParserResult solution = aContext.ParseSolution(slnFile.Path);

      aContext.Information($"*** SLN: '{slnFile}'");

      return (solutionDirectoryFullPath, slnFile, solution);
    }

    public static TArgumentValue LoggedArgument<TArgumentValue>(this ICakeContext aContext, string aArgumentName, TArgumentValue aDefaultValue)
    {
      TArgumentValue argumentValue = aContext.Argument<TArgumentValue>(aArgumentName, aDefaultValue);

      aContext.Information($"*** ARG: {aArgumentName} = '{argumentValue}'");

      return argumentValue;
    }
  }
}