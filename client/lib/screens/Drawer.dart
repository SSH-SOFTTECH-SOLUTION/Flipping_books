import 'package:flutter/material.dart';

// Drawer class with screen highlighting
class MyDrawer extends StatelessWidget {
  final String currentScreen;
  final Function(String) onItemTap;

  MyDrawer({required this.currentScreen, required this.onItemTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width * 0.85,
      color: Color.fromARGB(255, 55, 54, 66),
      height: MediaQuery.of(context).size.height,
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          Container(
            height: 140,
            child: DrawerHeader(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.deepPurple,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 3,
                    child: Image.asset('assets/logo/LogoWhite1.png'),
                  ), // Replace with your logo path
                  Expanded(
                    flex: 1,
                    child: Row(
                      children: [
                        SizedBox(width: 15),
                        Text(
                          'Support as you learn',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          ListTile(
            shape: OutlineInputBorder(
              borderSide: BorderSide(
                color: currentScreen == 'All Books' ? Colors.green : Colors.white,
                width: 1,
              ),
            ),
            title: Text(
              'All Books',
              style: TextStyle(
                color: currentScreen == 'All Books' ? Colors.green : Colors.white,
              ),
            ),
            onTap: () {
              onItemTap('All Books');
            },
            trailing: Icon(
              Icons.chevron_right,
              color: currentScreen == 'All Books' ? Colors.green : Colors.white,
            ),
          ),
          ListTile(
            shape: OutlineInputBorder(
              borderSide: BorderSide(
                color: currentScreen == 'On Device' ? Colors.green : Colors.white,
                width: 1,
              ),
            ),
            title: Text(
              'On Device',
              style: TextStyle(
                color: currentScreen == 'On Device' ? Colors.green : Colors.white,
              ),
            ),
            onTap: () {
              onItemTap('On Device');
            },
            trailing: Icon(
              Icons.chevron_right,
              color: currentScreen == 'On Device' ? Colors.green : Colors.white,
            ),
          ),
          Divider(
            color: Colors.white,
          ),
          ListTile(
            leading: Icon(
              Icons.logout,
              color: Colors.white,
            ),
            title: Text(
              'Sign Out',
              style: TextStyle(color: Colors.white),
            ),
            subtitle: Text(
              'books@osbornebooks.co.uk',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () => showDialog(
              context: context,
              builder: (_) => AlertDialog(
                title: Text('Sign Out', style: TextStyle(fontWeight: FontWeight.bold)),
                content: Text('Are you sure you want to sign out?'),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                actions: <Widget>[
                  TextButton(
                    child: Text('Cancel', style: TextStyle(color: Colors.blue)),
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                  ),
                  TextButton(
                    child: Text('Sign Out', style: TextStyle(color: Colors.blue)),
                    onPressed: () {
                      // Implement sign out logic here
                      Navigator.of(context).pop();
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
