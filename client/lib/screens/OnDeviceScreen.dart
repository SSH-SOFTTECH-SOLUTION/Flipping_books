import 'package:flutter/material.dart';

// On Device Screen class (Plain for now)
class OnDeviceScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        'On Device Books',
        style: TextStyle(fontSize: 24, color: Colors.black),
      ),
    );
  }
}