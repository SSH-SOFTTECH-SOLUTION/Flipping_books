import 'package:flutter/material.dart';
import 'package:osborne_book_app/screens/AnimatedDrawer.dart';  // Ensure this file contains the DrawerWithAnimation class
import 'package:osborne_book_app/screens/BooksScreen.dart';     // Ensure this file contains the AllBooksScreen class
import 'package:osborne_book_app/screens/OnDeviceScreen.dart';  // This file contains the OnDeviceScreen class

void main() {
  runApp(OsborneApp());
}

class OsborneApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: DrawerWithAnimation(
        child: AllBooksScreen(),  // Start with the AllBooksScreen as the main content
        currentScreen: 'All Books',  // Set the currentScreen to 'All Books'
      ),
    );
  }
}