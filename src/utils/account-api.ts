export const AccountAPI = {
  createAccount: async (username: string, password: string) => {
    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
      return;
    }
  },
  deleteAccount: async (userId: number) => {
    const response = await fetch(`/api/account/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Unable to delete account: ${errorData.error}`);
      return;
    }
  },
};
