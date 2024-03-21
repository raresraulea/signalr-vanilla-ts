using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;

namespace SignalRWebpack.Hubs;

public class ChatHub : Hub<IChatClient>
{
    private List<string> AvailableGroupNames = new List<string>(new string[] { "Group1", "Group2", "Group3" });

    private static Dictionary<string, string> ConnectionIds = new Dictionary<string, string>();

    private static Dictionary<string, HashSet<string>> GroupConnections = new Dictionary<string, HashSet<string>>();

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var connectionId = Context.ConnectionId;
        var userId = ConnectionIds[connectionId];

        foreach (var groupName in GroupConnections.Keys)
        {
            if (GroupConnections[groupName].Contains(connectionId))
            {
                GroupConnections[groupName].Remove(connectionId);
                var onlineUsers = GroupConnections[groupName].Select(id => ConnectionIds[id]);
                await Clients.Group(groupName).announceNewConnectionsOnGroup(onlineUsers.ToArray());
            }
        }

        ConnectionIds.Remove(connectionId);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task NewMessage(string username, string message) =>
        await Clients.All.onMessageReceived(username, message);

    public async Task<string> OnConnected(string username)
    {
        try
        {
            Console.WriteLine("New connection");
            ConnectionIds.Add(Context.ConnectionId, username);
            await Clients.Caller.displayAvailableGroups(AvailableGroupNames);
        }
        catch (Exception e)
        {
            System.Console.WriteLine(e.Message);
        }

        return "TEST";
    }

    public async Task<string> JoinGroup(string groupName)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var id = ConnectionIds[Context.ConnectionId];

            if (!GroupConnections.ContainsKey(groupName))
            {
                GroupConnections[groupName] = new HashSet<string>();
            }
            GroupConnections[groupName].Add(Context.ConnectionId);

            await Clients.Group(groupName).onMessageReceived("", $"{id} has joined {groupName}");

            var onlineUsers = GroupConnections[groupName].Select(connectionId => ConnectionIds[connectionId]).ToArray();

            await Clients.Group(groupName).announceNewConnectionsOnGroup(onlineUsers);

            return "Joined group";
        }
        catch (Exception e)
        {
            System.Console.WriteLine(e.Message);
        }

        return "Joined group";
    }


    public async Task<string> LeaveGroup(string groupName)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            var id = ConnectionIds[Context.ConnectionId];

            await Clients.Group(groupName).onMessageReceived("", $"{id} has left {groupName}");

            if (GroupConnections.ContainsKey(groupName))
            {
                GroupConnections[groupName].Remove(Context.ConnectionId);

                var onlineUsers = GroupConnections[groupName].Select(connectionId => ConnectionIds[connectionId]).ToArray();

                await Clients.Group(groupName).announceNewConnectionsOnGroup(onlineUsers);
            }

            return "Left group";
        }
        catch (Exception e)
        {
            System.Console.WriteLine(e.Message);
            // Handle exception
        }

        return "Left group";
    }

    public async Task SendMessageToGroup(string groupName, string message)
    {
        string username = ConnectionIds[Context.ConnectionId];
        await Clients.Group(groupName).onMessageReceived(username, message);
    }

    public async Task<string> WaitForMessage(string connectionId)
    {
        System.Console.WriteLine("Waiting for message");
        string message = await Clients.Client(connectionId).GetMessage();

        return message;
    }
}