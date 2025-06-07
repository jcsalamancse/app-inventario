loadUsers(): void {
  this.userService.getUsers()
    .subscribe({
      next: (users: User[]) => {
        // Filtrado local por nombre, email o username
        const term = this.searchTerm.trim().toLowerCase();
        let filtered = users;
        if (term) {
          filtered = users.filter(u =>
            (u.FirstName && u.FirstName.toLowerCase().includes(term)) ||
            (u.LastName && u.LastName.toLowerCase().includes(term)) ||
            (u.Email && u.Email.toLowerCase().includes(term)) ||
            (u.UserName && u.UserName.toLowerCase().includes(term))
          );
        }
        this.users = filtered;
        this.totalItems = filtered.length;
      },
      error: (error: any) => {
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', {
          duration: 3000
        });
        console.error('Error loading users:', error);
      }
    });
}

toggleUserStatus(user: User): void {
  this.userService.deleteUser(user.Id).subscribe({
    next: () => {
      this.loadUsers();
      this.snackBar.open(
        `Usuario eliminado exitosamente`,
        'Cerrar',
        { duration: 3000 }
      );
    },
    error: (error: any) => {
      this.snackBar.open('Error al eliminar usuario', 'Cerrar', {
        duration: 3000
      });
      console.error('Error eliminando usuario:', error);
    }
  });
} 