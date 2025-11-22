# 📚 Admin Dashboard User Guide

## 🎯 Overview
The Admin Dashboard allows you to manage all museum content including temples, weapons, and fossils. All changes are reflected in **real-time** across the application.

---

## 🕌 Adding a New Temple

### Step-by-Step:

1. **Navigate to Temples Tab**
   - Click the "🕌 Temples" tab in the admin dashboard

2. **Click "➕ Add Temple" Button**
   - Green button in the top-right corner

3. **Fill Required Fields** (marked with *):
   - **Temple Name*** - e.g., "Brihadeeswara Temple"
   - **Dynasty*** - e.g., "Chola Dynasty"
   - **Builder*** - e.g., "Raja Raja Chola I"

4. **Fill Optional Fields**:
   - **Time Period** - e.g., "11th Century AD (1010 AD)"
   - **Historical Significance** - JSON format describing importance
   - **Weapon Used** - e.g., "Mace and Battle Axe"
   - **Static Image URL** - Path to temple image
   - **3D Model Embed ID** - Sketchfab model ID
   - **Audio Story URL** - Path to audio narration file

5. **Click "💾 Save" Button**
   - ✅ Success message will appear
   - New temple appears at the TOP of the list immediately
   - No page refresh needed!

### Example Temple Entry:
```
Name: Meenakshi Temple
Builder: Nayak Kings
Dynasty: Madurai Nayak Dynasty
Time Period: 17th Century AD
Historical Significance: {"description": "Famous for its towering gopurams and intricate sculptures"}
Weapon Used: Sword and Shield
Static Image URL: /static/images/temples/meenakshi.jpg
Audio Story URL: /static/audio/temples/meenakshi_story.mp3
```

---

## ⚔️ Adding a New Weapon

### Step-by-Step:

1. **Navigate to Weapons Tab**
   - Click the "⚔️ Weapons" tab

2. **Click "➕ Add Weapon" Button**

3. **Fill Required Fields**:
   - **Weapon Name*** - e.g., "Khanda"
   - **Type*** - e.g., "Sword", "Bow", "Mace"

4. **Fill Optional Fields**:
   - **Dynasty Context** - Comma-separated list: "Chola Dynasty, Pandya Dynasty"
   - **Description** - JSON format with weapon details
   - **Image URL** - Path to weapon image
   - **3D Model Embed ID** - Sketchfab model ID
   - **Audio Story URL** - Path to audio narration

5. **Click "💾 Save" Button**
   - ✅ Success message appears
   - New weapon shows immediately at the TOP

### Example Weapon Entry:
```
Name: Vel (Spear)
Type: Spear
Dynasty Context: Chola Dynasty, Pallava Dynasty, Pandya Dynasty
Description: {"origin": "Ancient Tamil warriors", "material": "Iron with wooden shaft"}
Image URL: /static/images/weapons/vel.jpg
Audio Story URL: /static/audio/weapons/vel_story.mp3
```

---

## 🦴 Adding a New Fossil

### Step-by-Step:

1. **Navigate to Fossils Tab**
   - Click the "🦴 Fossils" tab

2. **Click "➕ Add Fossil" Button**

3. **Fill Required Fields**:
   - **Fossil Name*** - e.g., "Tyrannosaurus Rex Tooth"
   - **Type*** - e.g., "Dinosaur", "Marine Life", "Plant"
   - **Era*** - e.g., "Cretaceous Period"

4. **Fill Optional Fields**:
   - **Age in Years** - e.g., 65000000 (65 million years)
   - **Description** - Details about the fossil
   - **Origin Location** - Where it was discovered
   - **Image URL** - Path to fossil image
   - **3D Model Embed ID** - Sketchfab model ID
   - **Audio Story URL** - Path to audio narration

5. **Click "💾 Save" Button**
   - ✅ Success appears
   - New fossil shows immediately at the TOP

### Example Fossil Entry:
```
Name: Ammonite Shell
Type: Marine Life
Era: Jurassic Period
Age in Years: 150000000
Description: Spiral-shelled marine mollusk
Origin Location: Ariyalur, Tamil Nadu
Image URL: /static/images/fossils/ammonite.jpg
```

---

## ✏️ Editing Existing Items

1. **Click the "✏️ Edit" button** on any item card
2. **Form pre-fills** with existing data
3. **Modify** any fields you want to change
4. **Click "💾 Save"**
5. **Real-time update** - Changes appear immediately!

---

## 🗑️ Deleting Items

1. **Click the "🗑️ Delete" button** on any item
2. **Confirmation popup** appears
3. Click **OK** to confirm
4. **Success message** appears
5. **Item removed immediately** from the list

---

## 🎨 Real-Time Features

### What Happens in Real-Time:

✅ **When you ADD an item:**
- New item appears at the TOP of the list instantly
- No page refresh needed
- Success notification shows

✅ **When you EDIT an item:**
- Updated information replaces old data immediately
- Card updates in place
- Success notification shows

✅ **When you DELETE an item:**
- Item disappears from list instantly
- Success notification confirms deletion

✅ **Multi-user Support:**
- If multiple admins are working, each sees their own changes immediately
- Other admins need to refresh to see changes made by others

---

## 📊 Analytics Tab

View visitor statistics:
- **Total Visits** - Overall visitor count
- **Unique Users** - Number of unique visitors
- **Average Duration** - Time spent in museum

---

## 🏆 Leaderboard Tab

View quiz high scores:
- Filter by game mode (Temples/Weapons/Fossils)
- See top 100 players
- View scores, dates, and game modes

---

## 💬 Feedback Tab

View user feedback:
- Read ratings (1-5 stars)
- View user comments
- See submission dates

---

## 🚨 Error Handling

### Common Errors & Solutions:

**"Please fill in required fields"**
- Solution: Fill Name and other required fields (marked with *)

**"Failed to save temple/weapon/fossil"**
- Solution: Check your internet connection
- Verify backend server is running
- Check console for detailed error

**"Failed to delete"**
- Solution: Item might not exist anymore
- Refresh the page and try again

**No items showing**
- Solution: Click the tab again to reload data
- Check if backend is running
- Verify database has data

---

## 💡 Best Practices

### 1. Use Descriptive Names
```
✅ Good: "Brihadeeswara Temple - Thanjavur"
❌ Bad: "Temple1"
```

### 2. Fill All Available Fields
- More information = Better user experience
- 3D models and audio make content engaging

### 3. Use Consistent Formats

**Time Periods:**
```
✅ "11th Century AD (1010 AD)"
✅ "7th Century AD (740 AD)"
❌ "1010"
```

**Dynasty Context (for weapons):**
```
✅ "Chola Dynasty, Pandya Dynasty, Pallava Dynasty"
❌ "Chola,Pandya,Pallava" (needs spaces)
```

### 4. Test After Adding
- View the item on the main site
- Check if images load
- Test 3D model if added
- Listen to audio if added

---

## 📁 File Paths

### Image Files
```
Backend: backend/app/static/images/
  - temples/temple_name.jpg
  - weapons/weapon_name.jpg
  - fossils/fossil_name.jpg

In Form: /static/images/temples/temple_name.jpg
```

### Audio Files
```
Backend: backend/app/static/audio/
  - temples/temple_story.mp3
  - weapons/weapon_story.mp3
  - fossils/fossil_story.mp3

In Form: /static/audio/temples/temple_story.mp3
```

### 3D Models
- Upload to Sketchfab.com
- Get the model ID from URL
- Example: `https://sketchfab.com/models/abc123def456`
- Use ID: `abc123def456`

---

## 🔄 Workflow Example

### Adding a Complete Temple Entry:

1. **Prepare your assets first:**
   - Upload image to `backend/app/static/images/temples/`
   - Upload audio to `backend/app/static/audio/temples/`
   - Upload 3D model to Sketchfab

2. **Go to Admin Dashboard**
   - Login as admin
   - Click Temples tab

3. **Click Add Temple**
   - Fill all fields with your prepared data
   - Click Save

4. **Verify**
   - See new temple at top of list
   - Click Edit to verify all data saved correctly
   - Visit main site to see it live

---

## ⚡ Keyboard Shortcuts

- **Esc** - Close add/edit form
- **Enter** - Submit form (when in a text field)
- **Tab** - Move to next field

---

## 🔒 Security Tips

1. **Change default admin password immediately**
2. **Don't share admin credentials**
3. **Logout when done** - Click "Logout" button
4. **Use strong passwords** for additional admins

---

## 📞 Troubleshooting

### Backend Not Responding
```bash
# Restart backend
cd backend
uvicorn app.main:app --reload
```

### Frontend Issues
```bash
# Restart frontend
cd frontend
npm run dev
```

### Data Not Loading
1. Check browser console (F12)
2. Verify backend is running on port 8000
3. Verify frontend is running on port 5173
4. Check database connection in backend logs

---

## ✅ Quick Checklist

Before adding new content:
- [ ] Assets ready (images, audio, 3D models)
- [ ] Files uploaded to correct folders
- [ ] Required fields prepared
- [ ] Backend server running
- [ ] Logged in as admin

After adding:
- [ ] Success message appeared
- [ ] Item visible in list
- [ ] All data saved correctly
- [ ] Test on main site

---

## 🎉 You're Ready!

The admin dashboard makes it easy to manage your museum content with:
- ✅ Real-time updates
- ✅ Simple forms
- ✅ Clear validation
- ✅ Success notifications
- ✅ Instant feedback

Happy content management! 🚀
