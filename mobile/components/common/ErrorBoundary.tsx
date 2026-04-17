import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  componentStack: string | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, componentStack: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, componentStack: info.componentStack ?? null });
    console.error('[ErrorBoundary]', error.message);
    console.error('[ErrorBoundary] stack:', error.stack);
    console.error('[ErrorBoundary] componentStack:', info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.label}>Message:</Text>
          <Text style={styles.message}>{this.state.error.message}</Text>
          {this.state.error.stack ? (
            <>
              <Text style={styles.label}>Stack:</Text>
              <Text style={styles.stack}>{this.state.error.stack}</Text>
            </>
          ) : null}
          {this.state.componentStack ? (
            <>
              <Text style={styles.label}>Component stack:</Text>
              <Text style={styles.stack}>{this.state.componentStack}</Text>
            </>
          ) : null}
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF6EC' },
  content: { padding: 16, paddingTop: 48 },
  title: { fontSize: 20, fontWeight: '700', color: '#C0392B', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#5C5144', marginTop: 12, marginBottom: 4 },
  message: { fontSize: 14, color: '#2C2418', fontFamily: 'monospace' },
  stack: { fontSize: 11, color: '#5C5144', fontFamily: 'monospace' },
});
