"use client";

import { useState } from "react";
import { Button } from "../ui/button";

type CodeOutput = {
  stdout: string;
  stderr: string;
  status: string;
};

export default function OutputArea() {
  const [output, setOutput] = useState<CodeOutput>({
    stdout: "",
    stderr: "",
    status: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = {
        stdout: "Sample output",
        stderr: "",
        status: "Success",
      };
      setOutput(result!);
    } catch (error) {
      setOutput({
        stdout: "",
        stderr: `Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        status: "Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card flex flex-col items-center p-4 rounded-lg max-w-screen overflow-scroll">
      <div>
        <Button
          className="hover:cursor-pointer"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Run Testcases"}
        </Button>
      </div>
      <pre className="p-4 w-full">
        {output.stdout || output.stderr || output.status ? (
          <div>
            {output.status && <div>Status: {output.status}</div>}
            {output.stdout && <div>Output: {output.stdout}</div>}
            {output.stderr && <div>Errors: {output.stderr}</div>}
          </div>
        ) : (
          "Your testcase output will appear here"
        )}
      </pre>
    </div>
  );
}
