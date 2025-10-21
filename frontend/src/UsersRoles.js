// UsersRoles component - manages users, groups, and permissions (RBAC)
import React, { useState, useEffect } from 'react';
import { Container, Typography, Tabs, Tab, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { Add } from '@mui/icons-material';
import axios from 'axios';

function UsersRoles() {
  const [tab, setTab] = useState(0);  // Active tab (Groups or Users)
  const [groups, setGroups] = useState([]);  // List of groups/roles
  const [users, setUsers] = useState([]);  // List of users
  const [permissions, setPermissions] = useState([]);  // Available permissions
  const [openGroup, setOpenGroup] = useState(false);  // Create group dialog
  const [openUser, setOpenUser] = useState(false);  // Assign groups dialog
  const [openNewUser, setOpenNewUser] = useState(false);  // Create user dialog
  const [currentGroup, setCurrentGroup] = useState({ name: '', permission_ids: [] });
  const [currentUser, setCurrentUser] = useState({ id: null, group_ids: [] });
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', group_ids: [] });

  // Helper to add JWT token to requests
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchGroups();
    fetchUsers();
    fetchPermissions();
  }, []);

  // Fetch all groups/roles
  const fetchGroups = async () => {
    const response = await axios.get('http://localhost:8000/api/groups/', getAuthHeader());
    setGroups(response.data);
  };

  // Fetch all users
  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:8000/api/users/', getAuthHeader());
    setUsers(response.data);
  };

  // Fetch all available permissions
  const fetchPermissions = async () => {
    const response = await axios.get('http://localhost:8000/api/permissions/', getAuthHeader());
    setPermissions(response.data);
  };

  // Create new group with selected permissions
  const handleSaveGroup = async () => {
    await axios.post('http://localhost:8000/api/groups/', currentGroup, getAuthHeader());
    fetchGroups();  // Refresh list
    setOpenGroup(false);
    setCurrentGroup({ name: '', permission_ids: [] });
  };

  // Assign groups to existing user
  const handleSaveUser = async () => {
    await axios.patch(`http://localhost:8000/api/users/${currentUser.id}/`, { group_ids: currentUser.group_ids }, getAuthHeader());
    fetchUsers();  // Refresh list
    setOpenUser(false);
    setCurrentUser({ id: null, group_ids: [] });
  };

  // Create new user with groups assigned
  const handleCreateUser = async () => {
    await axios.post('http://localhost:8000/api/users/', newUser, getAuthHeader());
    fetchUsers();  // Refresh list
    setOpenNewUser(false);
    setNewUser({ username: '', email: '', password: '', group_ids: [] });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Users & Roles</Typography>
      {/* Tab navigation between Groups and Users */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Groups" />
        <Tab label="Users" />
      </Tabs>
      {/* Groups tab - create groups and assign permissions */}
      {tab === 0 && (
        <Box sx={{ mt: 2 }}>
          <Button startIcon={<Add />} variant="contained" onClick={() => setOpenGroup(true)}>Create Group</Button>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Group Name</TableCell>
                  <TableCell>Permissions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.permissions.map(p => p.name).join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {/* Users tab - create users and assign to groups */}
      {tab === 1 && (
        <Box sx={{ mt: 2 }}>
          <Button startIcon={<Add />} variant="contained" onClick={() => setOpenNewUser(true)}>Add New User</Button>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Groups</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.groups.map(g => g.name).join(', ')}</TableCell>
                    <TableCell>
                      <Button onClick={() => { setCurrentUser({ id: user.id, group_ids: user.groups.map(g => g.id) }); setOpenUser(true); }}>Assign Groups</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Dialog open={openGroup} onClose={() => setOpenGroup(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Group Name" value={currentGroup.name} onChange={(e) => setCurrentGroup({ ...currentGroup, name: e.target.value })} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Permissions</InputLabel>
            <Select multiple value={currentGroup.permission_ids} onChange={(e) => setCurrentGroup({ ...currentGroup, permission_ids: e.target.value })} input={<OutlinedInput label="Permissions" />} renderValue={(selected) => permissions.filter(p => selected.includes(p.id)).map(p => p.name).join(', ')}>
              {permissions.map((permission) => (
                <MenuItem key={permission.id} value={permission.id}>
                  <Checkbox checked={currentGroup.permission_ids.includes(permission.id)} />
                  <ListItemText primary={permission.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGroup(false)}>Cancel</Button>
          <Button onClick={handleSaveGroup} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openUser} onClose={() => setOpenUser(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Groups</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Groups</InputLabel>
            <Select multiple value={currentUser.group_ids} onChange={(e) => setCurrentUser({ ...currentUser, group_ids: e.target.value })} input={<OutlinedInput label="Groups" />} renderValue={(selected) => groups.filter(g => selected.includes(g.id)).map(g => g.name).join(', ')}>
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  <Checkbox checked={currentUser.group_ids.includes(group.id)} />
                  <ListItemText primary={group.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUser(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openNewUser} onClose={() => setOpenNewUser(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
          <TextField fullWidth margin="dense" label="Email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <TextField fullWidth margin="dense" label="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Groups</InputLabel>
            <Select multiple value={newUser.group_ids} onChange={(e) => setNewUser({ ...newUser, group_ids: e.target.value })} input={<OutlinedInput label="Groups" />} renderValue={(selected) => groups.filter(g => selected.includes(g.id)).map(g => g.name).join(', ')}>
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  <Checkbox checked={newUser.group_ids.includes(group.id)} />
                  <ListItemText primary={group.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewUser(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UsersRoles;
