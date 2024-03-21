public interface IChatClient
{
    Task onMessageReceived(string username, string message);
    Task registerNewConnection(string username);
    Task newUserJoinedGroup(string username);
    Task displayAvailableGroups(List<string> availableGroups);
    Task announceNewConnectionsOnGroup(string[] onlineUsers);
    Task<string> GetMessage();
}