import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'BooksScreen.dart';
import 'Drawer.dart';
import 'OnDeviceScreen.dart';

// Drawer with Animation class
class DrawerWithAnimation extends StatefulWidget {
  final Widget child;
  final String currentScreen;

  DrawerWithAnimation({required this.child, required this.currentScreen});

  @override
  _DrawerWithAnimationState createState() => _DrawerWithAnimationState();
}

class _DrawerWithAnimationState extends State<DrawerWithAnimation> with SingleTickerProviderStateMixin {
  bool isDrawerOpen = false;
  late AnimationController _animationController;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _slideAnimation = Tween<Offset>(
      begin: Offset(-1, 0),
      end: Offset(0, 0),
    ).animate(_animationController);
  }

  void toggleDrawer() {
    setState(() {
      if (isDrawerOpen) {
        _animationController.reverse();
      } else {
        _animationController.forward();
      }
      isDrawerOpen = !isDrawerOpen;
    });
  }

  void navigateTo(String screen) {
    setState(() {
      isDrawerOpen = false;
      _animationController.reverse();
    });
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) {
        if (screen == 'All Books') {
          return DrawerWithAnimation(
            child: AllBooksScreen(),
            currentScreen: screen,
          );
        } else if (screen == 'On Device') {
          return DrawerWithAnimation(
            child: OnDeviceScreen(),
            currentScreen: screen,
          );
        }
        return Container();
      }),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          // Custom drawer
          SlideTransition(
            position: _slideAnimation,
            child: MyDrawer(
              currentScreen: widget.currentScreen,
              onItemTap: (screen) => navigateTo(screen),
            ),
          ),
          // Main content including AppBar and body
          AnimatedContainer(
            duration: Duration(milliseconds: 300),
            transform: Matrix4.translationValues(
                isDrawerOpen ? MediaQuery.of(context).size.width * 0.85 : 0, 0, 0),
            child: Scaffold(
              appBar: AppBar(
                title: Text(widget.currentScreen),
                backgroundColor: Colors.deepPurple,
                leading: IconButton(
                  icon: Icon(isDrawerOpen ? Icons.close : Icons.menu),
                  onPressed: toggleDrawer,
                ),
              ),
              body: widget.child,
            ),
          )
        ],
      ),
    );
  }
}
