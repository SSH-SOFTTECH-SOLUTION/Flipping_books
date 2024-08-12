// // import 'dart:io';
// // import 'package:flutter/cupertino.dart';
// // import 'package:flutter/material.dart';
// // import 'package:osborne_book_app/screens/Drawer.dart';
// // import 'BookCard.dart';
// //
// // class BooksScreen extends StatelessWidget {
// //   final List<Map<String, String>> books = [
// //     {"title": "ACCA Advanced Audit and Assurance Exam Kit", "imagePath": "assets/images/images1.jpg"},
// //     {"title": "ACCA Advanced Audit and Assurance Study Text", "imagePath": "assets/images/images2.jpg"},
// //     {"title": "ACCA Advanced Audit & Assurance 21/22 Exam Kit", "imagePath": "assets/images/images2.jpg"},
// //     {"title": "ACCA Advanced Audit & Assurance 22/22 Study Text", "imagePath": "assets/images/images2.jpg"},
// //     {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images1.jpg"},
// //     {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images2.jpg"},
// //     {"title": "ACCA Advanced Audit and Assurance Exam Kit", "imagePath": "assets/images/images1.jpg"},
// //     {"title": "ACCA Advanced Audit and Assurance Study Text", "imagePath": "assets/images/images2.jpg"},
// //     {"title": "ACCA Advanced Audit & Assurance 21/22 Exam Kit", "imagePath": "assets/images/images2.jpg"},
// //     {"title": "ACCA Advanced Audit & Assurance 22/22 Study Text", "imagePath": "assets/images/images2.jpg"},
// //     {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images1.jpg"},
// //     {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images2.jpg"},
// //     // Add more books as needed
// //   ];
// //
// //   @override
// //   Widget build(BuildContext context) {
// //     return Material(
// //       elevation: 8,
// //       child: Column(
// //         children: [
// //           AppBar(
// //             title: Text('All Books'),
// //             backgroundColor: Colors.deepPurple,
// //             leading: Builder(
// //               builder: (context) {
// //                 return IconButton(
// //                   icon: Icon(Icons.menu),
// //                   onPressed: () {
// //                     Scaffold.of(context).openDrawer();
// //                   },
// //                 );
// //               },
// //             ),
// //           ),
// //           Container(
// //             color: Color.fromARGB(100, 199, 199, 199),
// //             child: CustomScrollView(
// //               physics: const BouncingScrollPhysics(
// //                 parent: AlwaysScrollableScrollPhysics(),
// //               ),
// //               slivers: [
// //                 CupertinoSliverRefreshControl(
// //                   onRefresh: _refresh,
// //                 ),
// //                 SliverList(
// //                   delegate: SliverChildListDelegate([
// //                     Padding(
// //                       padding: const EdgeInsets.all(8.0),
// //                       child: GridView.builder(
// //                         itemCount: books.length,
// //                         gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
// //                           crossAxisCount: 3, // Number of columns
// //                           childAspectRatio: 0.6, // Adjust the aspect ratio as needed
// //                           crossAxisSpacing: 4,
// //                           mainAxisSpacing: 4,
// //                         ),
// //                         shrinkWrap: true,
// //                         physics: NeverScrollableScrollPhysics(),
// //                         itemBuilder: (context, index) {
// //                           return BookCard(
// //                             title: books[index]['title']!,
// //                             imagePath: books[index]['imagePath']!,
// //                           );
// //                         },
// //                       ),
// //                     ),
// //                   ]),
// //                 ),
// //               ],
// //             ),
// //           ),
// //         ],
// //       ),
// //
// //     );
// //   }
// //
// //   Future<void> _refresh() {
// //     return Future.delayed(Duration(seconds: 2));
// //   }
// // }
//
//
// import 'dart:io';
// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:osborne_book_app/screens/Drawer.dart';
// import 'BookCard.dart';
//
// class BooksScreen extends StatefulWidget {
//   @override
//   _BooksScreenState createState() => _BooksScreenState();
// }
//
// class _BooksScreenState extends State<BooksScreen> with SingleTickerProviderStateMixin {
//   final List<Map<String, String>> books = [
//     {"title": "ACCA Advanced Audit and Assurance Exam Kit", "imagePath": "assets/images/images1.jpg"},
//     {"title": "ACCA Advanced Audit and Assurance Study Text", "imagePath": "assets/images/images2.jpg"},
//     {"title": "ACCA Advanced Audit & Assurance 21/22 Exam Kit", "imagePath": "assets/images/images2.jpg"},
//     {"title": "ACCA Advanced Audit & Assurance 22/22 Study Text", "imagePath": "assets/images/images2.jpg"},
//     {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images1.jpg"},
//     {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images2.jpg"},
//     {"title": "ACCA Advanced Audit and Assurance Exam Kit", "imagePath": "assets/images/images1.jpg"},
//     {"title": "ACCA Advanced Audit and Assurance Study Text", "imagePath": "assets/images/images2.jpg"},
//     {"title": "ACCA Advanced Audit & Assurance 21/22 Exam Kit", "imagePath": "assets/images/images2.jpg"},
//     {"title": "ACCA Advanced Audit & Assurance 22/22 Study Text", "imagePath": "assets/images/images2.jpg"},
//     {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images1.jpg"},
//     {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images2.jpg"},
//   ];
//
//   bool isDrawerOpen = false;
//   late AnimationController _animationController;
//   late Animation<Offset> _slideAnimation;
//
//   @override
//   void initState() {
//     super.initState();
//     _animationController = AnimationController(
//       duration: const Duration(milliseconds: 300),
//       vsync: this,
//     );
//     _slideAnimation = Tween<Offset>(
//       begin: Offset(-1, 0),
//       end: Offset(0, 0),
//     ).animate(_animationController);
//   }
//
//   void toggleDrawer() {
//     setState(() {
//       if (isDrawerOpen) {
//         _animationController.reverse();
//       } else {
//         _animationController.forward();
//       }
//       isDrawerOpen = !isDrawerOpen;
//     });
//   }
//
//   @override
//   void dispose() {
//     _animationController.dispose();
//     super.dispose();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.transparent, // Set background color to transparent
//       body: Stack(
//         children: [
//           // Custom drawer
//           SlideTransition(
//             position: _slideAnimation,
//             child: MyDrawer(currentScreen: 'All books',),
//           ),
//           // Main content including AppBar and body
//           AnimatedContainer(
//             duration: Duration(milliseconds: 300),
//             transform: Matrix4.translationValues(
//                 isDrawerOpen ? MediaQuery.of(context).size.width * 0.85 : 0, 0, 0),
//             child: Scaffold(
//               backgroundColor: Color.fromARGB(255, 200, 200, 200),
//               appBar: AppBar(
//                 title: Text('All Books'),
//                 backgroundColor: Colors.deepPurple,
//                 leading: IconButton(
//                   icon: Icon(isDrawerOpen ? Icons.close : Icons.menu),
//                   onPressed: toggleDrawer,
//                 ),
//               ),
//               body: CustomScrollView(
//                 physics: const BouncingScrollPhysics(
//                   parent: AlwaysScrollableScrollPhysics(),
//                 ),
//                 slivers: [
//                   CupertinoSliverRefreshControl(
//                     onRefresh: _refresh,
//                   ),
//                   SliverPadding(
//                     padding: EdgeInsets.all(0), // Ensure padding is zero
//                     sliver: SliverGrid(
//                       gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
//                         crossAxisCount: 3, // Number of columns
//                         childAspectRatio: 0.6, // Adjust the aspect ratio as needed
//                         crossAxisSpacing: 4,
//                         mainAxisSpacing: 4,
//                       ),
//                       delegate: SliverChildBuilderDelegate(
//                             (context, index) {
//                           return BookCard(
//                             title: books[index]['title']!,
//                             imagePath: books[index]['imagePath']!,
//                           );
//                         },
//                         childCount: books.length,
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           )
//         ],
//       ),
//     );
//   }
//
//   Future<void> _refresh() {
//     return Future.delayed(Duration(seconds: 2));
//   }
// }

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:osborne_book_app/screens/Drawer.dart';

import 'BookCard.dart';

// All Books Screen class
class AllBooksScreen extends StatelessWidget {
  final List<Map<String, String>> books = [
    {"title": "ACCA Advanced Audit and Assurance Exam Kit", "imagePath": "assets/images/images1.jpg"},
    {"title": "ACCA Advanced Audit and Assurance Study Text", "imagePath": "assets/images/images2.jpg"},
    {"title": "ACCA Advanced Audit & Assurance 21/22 Exam Kit", "imagePath": "assets/images/images2.jpg"},
    {"title": "ACCA Advanced Audit & Assurance 22/22 Study Text", "imagePath": "assets/images/images2.jpg"},
    {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images1.jpg"},
    {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images2.jpg"},
    {"title": "ACCA Advanced Audit and Assurance Exam Kit", "imagePath": "assets/images/images1.jpg"},
    {"title": "ACCA Advanced Audit and Assurance Study Text", "imagePath": "assets/images/images2.jpg"},
    {"title": "ACCA Advanced Audit & Assurance 21/22 Exam Kit", "imagePath": "assets/images/images2.jpg"},
    {"title": "ACCA Advanced Audit & Assurance 22/22 Study Text", "imagePath": "assets/images/images2.jpg"},
    {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images1.jpg"},
    {"title": "ACCA Advanced Financial Management 21/22", "imagePath": "assets/images/images2.jpg"},
  ];

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      physics: const BouncingScrollPhysics(
        parent: AlwaysScrollableScrollPhysics(),
      ),
      slivers: [
        CupertinoSliverRefreshControl(
          onRefresh: _refresh,
        ),
        SliverPadding(
          padding: EdgeInsets.all(0), // Ensure padding is zero
          sliver: SliverGrid(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3, // Number of columns
              childAspectRatio: 0.6, // Adjust the aspect ratio as needed
              crossAxisSpacing: 4,
              mainAxisSpacing: 4,
            ),
            delegate: SliverChildBuilderDelegate(
                  (context, index) {
                return BookCard(
                  title: books[index]['title']!,
                  imagePath: books[index]['imagePath']!,
                );
              },
              childCount: books.length,
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _refresh() {
    return Future.delayed(Duration(seconds: 2));
  }
}

